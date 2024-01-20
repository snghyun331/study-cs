# 어댑터 패턴

✅ 기존 인터페이스에서 새로운 인터페이스에서 제공하는 메서드를 사용하려 할 때, 서로 호환되지 않는 인터페이스들을 어댑터처럼 연결해주는 디자인 패턴

✅ 기존의 클래스를 수정하지 않고 새로운 인터페이스에 맞게 호환작업을 중계해준다.

예) 한국에서는 220V를 쓰고 일본은 110V를 쓰는데, 220V로 만들어진 전자제품을 일본에서 쓰려면 중간에서 110V로 변환해주는 무언가(어댑터)를 사용해야한다. 

(간단한 코드 예시 - 어댑터란?)

글자를 공백으로 이어 붙여 출력해주는 프린터 클래스를 이용해 글자를 출력하고 있었다.

```jsx
// Printer.js
class Printer {
    constructor() {
        this.textArr = [];
    }
    pushText(text) {
        this.textArr.push(text);
    }
    print() {
        return this.textArr.join(' ');
    }
}

// main.js
import Printer from './Printer'; 

let printer = new Printer();
printer.pushText('Hello');
printer.pushText('Hey');

let result = printer.print();
console.log(result); // Hello Hey
```

해시태그를 붙여서 출력해주는 새로운 프린터가 출시하여 그 프린터로 교체하고자 한다. 그리고 새로 출시된 프린터의 명세는 기존과 미묘하게 다르다고 가정한다.

```jsx
// HashTagPrinter.js
class HashTagPrinter {
  constructor() {
      this.textArr = [];
  }
  pushText(text) {
      this.textArr.push(text);
  }
  printWithHashTag() { 
      return this.textArr.map(text => `#${text}`).join(' ');
  }
}

// main.js  (클라이언트는 기존과 동일하게 작상해보자)
import HashTagPrinter from './HashTagPrinter';

let printer = new HashTagPrinter();  // HashTagPrinter printer로 교체
printer.pushText('Hello');
printer.pushText('Hey');

let result = printer.print(); // printer는 명세가 맞지않아 에러가 발생한다.
console.log(result);
```

220V로 만든 전자제품을 110V에서 사용할 수 없듯이, HashTagPrinter에는 print()가 아닌 printWithHashTage()을 사용하고 있어서 컴파일 에러가 발생한다.

해결방법

1. let result = printer.printWithHashTag 으로 변경
    - 실제 코드에서는 저것 이상으로 변경해야할 수 있음. 좋은 코드는 최소한의 변경으로 변화에 대응할 수 있어야 한다.
2. 변압기 역할을 하는 어떤 무언가(어댑터)를 만들어주면 된다. 클라이언트 코드는 수정하지 않고.
    
    <어댑터 만들기>
    
    ```jsx
    // HashTagAdapter.js
    
    class HashTagAdapter {
      constructor(hashTagPrinter) {
          this.printer = hashTagPrinter;
      }
    
      pushText(text) {
          this.printer.pushText(text);
      }
    
      print() {
          // print()가 호출될 때 printWithHashTag()가 동작
          return this.printer.printWithHash(); 
      }
    }
    
    // main.js (클라이언트)
    let printer = new HashTagAdapter(new HashTagPrinter());
    printer.pushText('Hello');
    printer.pushText('Hey');
    
    console.log(printer.print()); // #Hello #Hey
    ```
    
    명세가 맞지 않는 부분을 맞춰주기반 하면 된다.
    

## 주요 구성 요소

섭씨 온도를 화씨 온도로 변환하는 어댑터 패턴을 사용하는 상황을 예시로 들어보자

1. **어댑티(Adaptee) :** 아직 호환되지 않은 기존 클래스(인터페이스)
    
    ```tsx
    // 섭씨로 온도를 나타내는 기존 클래스
    class CelsiusTemp {
      private temperatureCelsius: number;
    
      constructor(temperatureCelsius: number) {
        this.temperatureCelsius = temperatureCelsius;
      }
    
      getTemperatureCelsius(): number {
        return this.temperatureCelsius;
      }
    }
    ```
    
2. **타겟(Target) :** 클라이언트가 직접적으로 호출하는 인터페이스(어댑터가 구현하는 인터페이스)
    
    ```tsx
    // 클라이언트가 사용할 온도를 나타내는 인터페이스
    interface TemperatureTarget {
      getTemperatureFahrenheit(): number;
    }
    ```
    
3. **어댑터(Adapter) :** 타켓 인터페이스를 구현하여 클라이언트 요청을 어댑티로 전달하는 클래스
    
    ```tsx
    // 섭시를 화씨로 변환하는 어댑터 클래스
    class CelsiusToFahrenheitAdapter implements TemperatureTarget {
      private celsiusTemp: CelsiusTemp;
    
      constructor(celsiusTemp: CelsiusTemp) {
        this.celsiusTemp = celsiusTemp;
      }
    
      getTemperatureFahrenheit(): number {
        return (this.celsiusTemp.getTemperatureCelsius() * 9) / 5 + 32;  // 💛
      }
    }
    ```
    
4. **클라이언트 :** 특정 작업을 요청하는 클래스
    
    ```tsx
    function displayTemperatureInFahrenheit(temperatureTarget: TemperatureTarget): void {
      console.log(`Temperature in Fahrenheit: ${temperatureTarget.getTemperatureFahrenheit()}`);
    }
    const celsiusTemperature = new CelsiusTemp(25);
    const adapter = new CelsiusToFahrenheitAdapter(celsiusTemperature);
    
    displayTemperatureInFahrenheit(adapter); // Temperature in Fahrenheit: 77
    ```
    
    클라이언트는 TemperatureTarget 인터페이스를 통해 어댑터를 이용하여 섭씨를 화씨로 변환된 온도를 얻을 수 있다.
    

## 언제 사용하면 좋을까? 전략 vs 어댑터

**<공통 요구사항>**

클라이언트가 서로 다른 2개의 클래스에 의존하고자 할 때, 하나의 추상화된 인터페이스로 의존되어야 한다.
![Untitled](https://github.com/snghyun331/study-cs/assets/108854903/b5326c61-02bb-4813-9e01-2bc60b3e306a)

**방법 1. 클래스를 수정한다 (전략패턴)**

서로 다른 클래스 2개의 코드를 각각 수정하여 인터페이스를 구현할 수 있게 한다. 메서드명도 서로 통일시킨다면 클라이언트가 하나의 인터페이스를 통해 달라지는 클래스들을 의존할 수 있게 된다.
![Untitled (1)](https://github.com/snghyun331/study-cs/assets/108854903/a2b5cc23-1a61-4301-8547-f8cbb6008bee)

<**추가 요구사항>**

**만약 의존하는 클래스들의 코드를 수정할 수 없다면?**

외부 라이브러리를 사용하는 경우, 수정해야하는 코드 양이 너무 많다던가 등등..

<br/>

**방법2. 인터페이스와 의존하고자 하는 클래스 사이에 어댑터를 둔다 (어댑터 패턴)**

DoAdater과 RunAdapter를 사이에 두어 DoClass와 RunClass의 수정 없이 요구사항을 만족시킬 수 있다.
![Untitled (2)](https://github.com/snghyun331/study-cs/assets/108854903/54ce23a1-f2fd-4598-a08a-e6c5ceef4899)

```typescript

class DoAdapter implements Interface {
  execute(): void {
    const doObject = new DoClass()
    doObject.do()
  }
}

class RunAdapter implements Interface {
  execute(): void {
    const runObject = new RunClass()
    runObject.run()
  }
}

```

<br/>

> **의존하는 클래스의 코드가 수정 가능하다면 전략 패턴이 좀 더 간단한 해결방법이 되고, 그렇지 않다면 어댑터 패턴이 고려되어야 한다.**
> 

<br/>


## References

[요즘 IT](https://yozm.wishket.com/magazine/detail/2077/)

[https://dev-momo.tistory.com/entry/Adapter-Pattern-어댑터-패턴](https://dev-momo.tistory.com/entry/Adapter-Pattern-%EC%96%B4%EB%8C%91%ED%84%B0-%ED%8C%A8%ED%84%B4)

https://siyoon210.tistory.com/166
