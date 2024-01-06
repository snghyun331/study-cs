# 팩토리 패턴

- 클래스가 객체를 생성하는 패턴이다. (class 안에 new)
    
  ```typescript
  class LatteFactory {
    static createCoffee() {
        return new Latte()
    }
  }
  ```
    
팩토리 패턴은 두가지 종류로 나뉜다.

- **팩토리 메서드 패턴 (Factory Method Pattern)**
- **추상 팩토리 패턴 (Abstract Factory Pattern)**

## 팩토리 메서드 패턴

- 객체 생성을 캡슐화하고 **서브 클래스**에서 어떤 클래스의 인스턴스를 만들지를 결정하는 패턴
  <details>
  <summary><strong>※ 캡슐화</strong></summary>
  <div markdown="1">
  
   ✔ 데이터와 그 데이터를 처리하는 메서드를 **하나로 묶어서 외부에서의 접근을 제어**하는 것
    
    ✔ 객체의 내부 구현을 외부로부터 감추는 것
    
    ✔ 관련 OOP원칙: **정보은닉**
    
    ```tsx
    class Car {
        private model: string;
        constructor(model: string, year: number) {
            this.model = model;
        }
        // public 메서드 (getter, setter)
        getModel(): string {
            return this.model;
        }
        setModel(newModel: string): void {
            this.model = newModel;
        }
    }
    // 객체 생성
    let myCar = new Car("KIA", 2022);
    
    // private 멤버에 접근할 수 없음
    // console.log(myCar.model); // 에러 발생
    
    // public 메서드를 통한 접근 (getter)
    console.log(myCar.getModel()); // 출력: KIA
    
    // public 메서드를 통한 값 변경 (setter)
    myCar.setModel("Hyundai");
    
    console.log(myCar.getModel()); // 출력: Hyundai
    ```
    
    - `private`로 선언된 `model`과 `year`변수는 `myCar.model` 또는 `myCar.year`과 같이 직접적으로 접근하는 것이 허용되지 않는다.
    - `public`으로 선언된 `getModel()`과 `setModel()`을 통해서만 `model`과 `year`에 접근할 수 있다.
    - 이렇게 하면 객체의 내부 상태를 외부로부터 숨기고, **상태를 읽고 변경하는 필요한 메서드를 제공**함으로써 캡슐화를 달성하게 된다
  
  </div>
  </details>

클라이언트에서 직접 new 연산자를 통해 제품 객체를 생성하지 않는다.

제품 객체들을 도맡아 생성하는 공장 클래스를 만들고, 이를 상속하는 서브 공장 클래스의 메소드에서 여러가지 제품 객체 생성을 각각 책임진다.

부모 추상 클래스는 인터페이스에만 의존하고 실제로 어떤 구현 클래스를 호출할 지는 서브 클래스에서 결정한다.

이렇게 하면 새로운 구현 클래스가 추가되어도 기존 Factory 코드의 수정 없이 새로운 Factory 를 추가할 수 있다.

### **팩토리 패턴의 주요 구성 요소 및 작성 순서**

1. **Product (제품):** 생성될 객체의 인터페이스를 정의한다.
    
    ```tsx
    // Product: 생성될 객체의 인터페이스
    // 제품 객체 추상화 (인터페이스)
    interface Product {
        getName(): string;
        display(): void;
    }
    ```
    
    - `Product` 인터페이스 정의
2. **ConcreteProduct (구체적인 제품):** Product 인터페이스를 구현하는 클래스로서, 실제로 생성되는 객체를 나타낸다.
    
    ```tsx
    // ConcreteProduct: Product를 구현한 구체적인 제품
    // 제품 구현체
    class ConcreteProduct implements Product {
        constructor(private name: string) {}
        getName(): string {
            return this.name;
        }
        display(): void {
            console.log(`ConcreteProduct: ${this.name}`);
        }
    }
    ```
    
    - ConcreteProduct 클래스는 Product 인터페이스를 구현하여 **구체적인 제품**을 나타냄
    - 각 제품은 반드시 `getName`과 `display`을 구현해야한다.
3. **Factory (공장) :** 팩토리 메서드를 정의하는 인터페이스나 추상 클래스입니다. 이 인터페이스에는 객체를 생성하는 메서드, 즉 팩토리 메서드가 정의되어있음
    
    ```tsx
    // 1️⃣
    // Factory: 팩토리 메서드를 정의하는 인터페이스
    interface Factory {
        createProduct(name: string): Product;
    }
    
    // 2️⃣
    // Factory: 팩토리 메서드를 정의하는 추상 클래스
    abstract class Factory {
        abstract createProduct(name: string): Product;
    }
    ```
    
    1️⃣ 
    
    - `createProduct` : 제품(Product)을 생성하는 팩토리 메서드로, 해당 메서드는 `name`을 인자로 받아서 Product **인터페이스**를 반환
    - `createProduct`는 인터페이스에 선언되었기 때문에, 이 인터페이스를 구현하는 클래스는 `createProduct` 메서드를 반드시 구현해야함
    
    2️⃣
    
    - `Factory` 클래스는 추상 클래스로 정의되었기 때문에 직접 인스턴스를 생성할 수 없고, 상속을 통해 하위 클래스에서 구현이 이루어짐
    - **`abstract`** 키워드가 사용된 **`createProduct`** 메서드는 추상 메서드로, 하위 클래스에서 반드시 구현
    - 팩토리 메서드를 추상 메서드로 선언함으로써, 하위 클래스에서 구체적인 제품을 어떻게 생성할지에 대한 결정을 강제할 수 있음
    
    ※ 그런데 일반적으로 Class-extends와 Interface-implements 끼리 짝궁이어서 1️⃣방법 interface를 사용하는 것이 좋을 것 같다.
    
4. **ConcreteFactory (구체적인 공장):** Factory를 상속하며, 실제로 팩토리 메서드를 구현하여 객체의 생성을 담당
    
    ```tsx
    // ConcreteFactory: Factory를 상속하고, 팩토리 메서드를 구현하는 구체적인 생성자
    class ConcreteFactory implements Factory {
        createProduct(name: string): Product {
            return new ConcreteFactory(name);
        }
    }
    ```
    
    - createProduct 메서드를 구현하여 **실제로 제품을 생성하고 반환**한다. 여기서 `ConcreteProduct` 클래스를 사용하여 제품을 생성한다.
    - 정리하면, `createProduct` 메서드를 호출하면 `ConcreteProduct`가 생성되어 반환되는 형태이고, 이러한 구조는 클라이언트 코드에서는 어떤 구체적인 제품이 생성되는지 알 필요가 없게 하면서도 `ConcreteFactory` 클래스에서는 구체적인 제품의 생성 방법을 자유롭게 변경할 수 있도록 한다.
5. **Client (팩토리 패턴을 사용하여 객체 생성하기)**
    
    ```tsx
    // 팩토리 메서드를 사용하여 객체 생성
    const factory: Factory = new ConcreteFactory();  
    const product: Product = creator.createProduct("ExampleProduct");
    product.display(); // 출력: ConcreteProduct: ExampleProduct
    ```
    
    - `ConcreteFactory` 클래스는 `Factory` 인터페이스(혹은 추상 클래스)를 구현하므로, `Factory` 타입의 변수 `factory`를 선언하고 `ConcreteFactory`의 인스턴스를 생성한다.
    - `factory` 객체의 `createProduct` 메서드를 호출하여 실제로 제품을 생성한다.
    - 생성된 제품 객체(`product`)의 `display` 메서드를 호출하여 제품의 정보를 출력한다.

> 종합하면, 클라이언트 코드에서는 구체적인 제품이 어떻게 생성되는지 몰라도 되며, `Factory`와 `ConcreteFactory` 클래스를 통해 제품을 생성하고 사용할 수 있다는 것이다.**
이렇게 함으로써 제품의 생성 방법을 변경하거나 새로운 제품을 추가할 때, 클라이언트 코드에는 영향을 주지 않으면서 확장성과 유연성을 제공한다.
> 

### 확장 방법

개발/폐쇄 원칙을 준수 → 확장할 때 **기존 코드의 변경이 없이 새로운 코드를 추가만 하면 된다.**

**새로운 Product과 Factory**

```tsx
class ConcreteProduct2 implements Product {
    constructor(private name: string) {}
    getName(): string {
        return this.name;
    }
    display(): void {
        console.log(`Yeah: ${this.name}`);
    }
}
```

- ConcreteProduct 클래스와 도일하게 Product 인터페이스를 구현하는 새로운 ConcreteProduct 클래스 추가

```tsx
class ConcreteFactory2 implements Factory {
    createProduct(name: string): Product {
        return new ConcreteProduct2(name);
    }
}
```

- ConcreteFactory 클래스와 동일하게 ConcreteFactory2 클래스 정의

```tsx
const factory: Factory = new ConcreteFactory();  
const product: Product = creator.createProduct("ExampleProduct");
product.display(); 

// 위 클라이언트 코드 수정 없이 다른 곳에서 사용 가능
const factory2: Factory = new ConcreteFactory2();  
const product2: Product = factory2.createProduct("ExampleProduct");
product2.display(); 
```

- 기존 코드의 변경 없이 새로 선언한 클래스만 사용하여 확장 가능

### 팩토리 패턴 사용 시기

- 클래스 생성과 사용의 처리 로직을 분리하여 **결합도를 낮추고자** 할 때
- 코드가 동작해야 하는 객체의 유형과 종속성을 캡슐화를 통해 **정보 은닉 처리** 할 경우
- 객체의 생성 코드를 **별도의 클래스 / 메서드로 분리 함으로써** 객체 생성의 변화에 대해 대비를 하기 위해 이용한다.

### **팩토리 메서드의 장점**

- 팩토리 메서드를 통해 객체의 생성 후 공통으로 할 일을 수행하도록 지정해줄 수 있다.
- **단일 책임 원칙** 준수 : 객체 생성 코드를 한 곳 (패키지, 클래스 등)으로 이동하여 코드를 유지보수하기 쉽게 할수 있으므로 원칙을 만족
- **개방/폐쇄 원칙** 준수 : 기존 코드를 수정하지 않고 새로운 유형의 제품 인스턴스를 프로그램에 도입할 수 있어 원칙을 만족 (확장성 있는 전체 프로젝트 구성이 가능)

### **팩토피 메서드의 단점**

- 각 제품 구현체마다 팩토리 객체들을 모두 구현해주어야 하기 때문에 구현체가 늘어날 때마다 펙토리 클래스가 증가하여 서브 클래스 수가 폭발
- 코드의 복잡성이 증가

### 팩토리 메서드 패턴 흐름 및 구분 한눈에 보기 
![Untitled (1)](https://github.com/snghyun331/study-cs/assets/108854903/bece6515-fd7c-40f9-b384-cc0a5f860cee)

![Untitled (2)](https://github.com/snghyun331/study-cs/assets/108854903/b58541f1-7041-4560-9c19-906ca55297af)
- `Factory(=Creator)`과 `Product`는 **추상화** 인터페이스 파트
- `ConcreteFactory` `ConcreteFactory2` `ConcreteProduct` `ConcreteProduct2`는 구체적인 **구현** 파트

※ 그림 출처: 인파 Dev

<br/>

⭐ 이해하기 쉽게 클래스 및 인터페이스의 이름을 수정하면,


> Product → User   
> ConcreteProduct → NaverUser   
> ConcreteProducr2 → KakaoUser  
> 
> Factory → UserFactory   
> ConcreteFactory → NaverUserFactory   
> ConcreteFactory2 → KakaoUserFactory   
