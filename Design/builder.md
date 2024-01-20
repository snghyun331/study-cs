# 빌더 패턴

✅ 객체의 생성과정과 표현을 분리하여 다양한 구성의 인스턴스를 만드는 생성 패턴

✅ 생성자에 들어갈 매개변수를 메서드로 하나하나 받아들이고 마지막에 통합 빌드해서 객체 생성

## 타입스크립트 예시

**햄버거**의 선택적 속재료들을 보다 유연하게 받아 다양한 타입의 햄버거(인스턴스)를 생성할 수 있다.

**HamburgerBuilder :**  Hamburger 객체를 생성하는 역할

```tsx
class HamburgerBuilder {
  private size: string;  // 필수 멤버
  private cheese: number = 0; // 선택
  private tomato: number = 0;  
  private pickles: number = 0;

  constructor(size: string) {  // 필수 멤버는 별도의 생성자에서 받기
    this.size = size;
  }

  addCheese(cheese: number): HamburgerBuilder {
    this.cheese = cheese;
    return this;  // 연속적으로 빌더 메서드들을 체이닝하여 호출할 수 있다.
  }

  addTomato(tomato: number): HamburgerBuilder {
    this.tomato = tomato;
    return this;
  }

  addPickles(pickles: number): HamburgerBuilder {
    this.pickles = pickles;
    return this;
  }

  build(): Hamburger {
    return new Hamburger(this.size, this.cheese, this.tomato, this.pickles);
  }
}
```

- 초기화가 필수인 멤버 size는 빌더의 생성자로 받게 하여 빌더 객체가 생성되도록 유도하고, 선택적으로 추가될 수 있는 `cheese`, `tomato`, `pickles`는 초기값을 가지도록 한다.
    - 이렇게 하면  필수 멤버와 선택 멤버를 구분할 수 있다.
- `addCheese`, `addTomato`, `addPickles` 메서드는 각각 치즈, 토마토, 피클의 양을 설정하고 빌더 객체 자신을 반환한다. 이렇게 하면 **메서드 체이닝을 통해 여러 메서드를 호출할 수 있다**
- `build` 메서드는 최종적으로 설정된 값들을 사용하여 `Hamburger` 객체를 생성하고 반환한다.

**Hamburger**

```tsx
class Hamburger {
  private size: string;
  private cheese: number;
  private tomato: number;
  private pickles: number;

  constructor(size: string, cheese: number, tomato: number, pickles: number) {
    this.size = size;
    this.cheese = cheese;
    this.tomato = tomato;
    this.pickles = pickles;
  }

	// getter 함수들 .....
}
```

- `Hamburger` 클래스는 빌더를 통해 생성된 햄버거 객체를 나타냅니다.
- 필수 멤버인 `size`와 선택적 멤버인 `cheese`, `tomato`, `pickles`를 가지고 있습니다.
- 생성자를 통해 이 멤버들의 값을 초기화합니다.

**Client**

```tsx
const burger = new HamburgerBuilder('Large')
		.addCheese(1)
		.addTomato(2)
		.addPickles(3)
		.build();

console.log(burger); // Hamburger { size: 'Large', cheese: 1, tomato: 2, pickles: 3 }
```

## 빌더 패턴은 언제 써야 할까

**✔️ 생성자 파라미터(선택적 매개변수)가 많을 때 유용하게 사용됨**

**✔️ 생성 로직 또는 조건이 복잡해질 때**

- 챔피언 이름은 최소 3글자 이상, hp, mp는 0 이상이어야한다는 조건이 있다고 가정할 때, 생성자 내에 각 property validation 코드가 들어간다.
    
    ```tsx
    class Champion {
      
      constructor(
        private readonly name: string,
        private readonly ops : number,
        private readonly obp: number
      ) {
        if (name.length < 3) throw Error('name must be at least 3 characters.')
        if (ops < 0) throw Error('OPS should be over 0.9')
        if (obp < 0) throw Error('OBP should be over 0.3')
        
        // .. 만약 조건식이 더 많아진다면?
      }
    // ..
    }
    ```
    
- 이러한 조건식들이 더 많아지면 생성자가 거대해짐

➡️ 해결방법: **빌더 패턴 적용**

```tsx
// 빌더 클래스는 속성에 대한 유효성을 검사를 처리 → 더 안전하게 객체 생성
class ChampionBuilder {
  private name: string;
  private ops: number;
  private obp: number;
  constructor() {}

  addName(name: string): this {
    if (name.length < 3) throw Error('name must be at least 3 characters.');
    this.name = name;
    return this;
  }

  addOps(ops: number): this {
    if (ops < 0.9) throw Error('OPS should be over 0.9');
    this.ops = ops;
    return this;
  }

  addObp(obp: number): this {
    if (obp < 0.3) throw Error('OBP should be over 0.3');
    this.obp = obp;
    return this;
  }

  build(): Champion {
    return new Champion(this.name, this.ops, this.obp);
  }
}

```

```tsx
// 도메인 객체(Champion 클래스)는 단순히 생성된 객체를 **표현**하고, 해당 객체의 **행위**를 정의
class Champion {
  constructor(
    private readonly name: string,
    private readonly ops: number,
    private readonly obp: number,
  ) {}

  static builder(): ChampionBuilder {
    return new ChampionBuilder();
  }
}
```

```tsx
const champion = Champion.builder().addName('Chris').addObp(0.7).addOps(1.1).build();

console.log(champion);  // Champion { name: 'Chris', ops: 1.1, obp: 0.7 }
```

## 보완

### **문제점1 : 새로운 property가 추가될 때마다 Builder에서도 새로운 property를 추가해야하고, add함수도 새로 추가하는 증 작업이 너무 많아짐**

한곳의 수정이 다른데 영향을 많이 받게 된다는것은 유지보수성에도 좋지않고 개발 편의상으로도 좋지않다

→ **Builder 클래스에 `object: Hamburger` 을 추가한다.**  ※ 도메인 클래스에 선언되었던 private 변수들은 모두 public으로

```tsx
class Hamburger {
  size: string;
  cheese: number;
  tomato: number;
  pickles: number;

  constructor(size: string) {
    this.size = size;
  }
}
```

```tsx
class HamburgerBuilder {
  object: Hamburger;

  constructor(size: string) {
    this.object = new Hamburger(size);
  }

  addCheese(cheese: number): HamburgerBuilder {
    this.object.cheese = cheese;
    return this; 
  }

  addTomato(tomato: number): HamburgerBuilder {
    this.object.tomato = tomato;
    return this;
  }

  addPickles(pickles: number): HamburgerBuilder {
    this.object.pickles = pickles;
    return this;
  }

  build(): Hamburger {
    return this.object;
  }
}
```

```tsx
const burger = new HamburgerBuilder('Large')
		.addCheese(1)
		.addTomato(2)
		.addPickles(3)
		.build();

console.log(burger); // Hamburger { size: 'Large', cheese: 1, tomato: 2, pickles: 3 }
```

### 문제점2 : 모든 빌더 클래스마다 constructor와 build, object property 선언이 반복적으로 들어간다.

→ 모든 빌더 클래스에 공통적으로 들어가는 부분은 하나의 클래스(BuilderCommon<T>) 로 빼고 이를 상속

```tsx
interface ConstructorType<T> {
  new (...args: any[]): T;
}

class BuilderCommon<T> {
  public object: T;

  constructor(ctor: ConstructorType<T>) {
    this.object = new ctor();
  }
  build(): T {
    return this.object;
  }
}

class Hamburger {
  size: string;
  cheese: number;
  tomato: number;
  pickles: number;

  constructor(size: string) {
    this.size = size;
  }
}

class HamburgerBuilder extends BuilderCommon<Hamburger> {
  constructor(size: string) {
    super(Hamburger);
    this.object.size = size;
  }

  addCheese(cheese: number) {
    this.object.cheese = cheese;
    return this; // 연속적으로 빌더 메서드들을 체이닝하여 호출할 수 있다.
  }

  addTomato(tomato: number) {
    this.object.tomato = tomato;
    return this;
  }

  addPickles(pickles: number) {
    this.object.pickles = pickles;
    return this;
  }
}

const burger = new HamburgerBuilder('Large').addCheese(1).addTomato(2).addPickles(3).build();

console.log(burger); // Hamburger { size: 'Large', cheese: 1, tomato: 2, pickles: 3 }
```

- `new(): T`가 아닌 `new (...args: any[]): T` 를 해주는 이유
    
    : Hamburger 클래스의 생성자는 `size` 매개변수를 받도록 되어 있기 때문에,  `new Hamburger()`를 호출하면 필수 매개변수 `size`를 제공하지 않아 에러가 발생한다.
    
    따라서 `...args: any[]`를 사용하여 임의의 매개변수를 자유롭게 받도록 했다.

<br/>

## References

[인파 Dev](https://inpa.tistory.com/entry/GOF-%F0%9F%92%A0-%EB%B9%8C%EB%8D%94Builder-%ED%8C%A8%ED%84%B4-%EB%81%9D%ED%8C%90%EC%99%95-%EC%A0%95%EB%A6%AC)

https://velog.io/@milkcoke/Typescript-builder-pattern

[https://siosio3103.medium.com/typescript-디자인패턴-0-builder-빌더-패턴-90552ae0b763](https://siosio3103.medium.com/typescript-%EB%94%94%EC%9E%90%EC%9D%B8%ED%8C%A8%ED%84%B4-0-builder-%EB%B9%8C%EB%8D%94-%ED%8C%A8%ED%84%B4-90552ae0b763)
