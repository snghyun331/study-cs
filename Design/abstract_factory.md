# 추상 팩터리 패턴

- 연관성 있는 **객체(제품) 군**이 여러 개 있을 경우 이들을 묶어 추상화하고, 어떤 구체적인 상황이 주어지면 팩토리 객체에서 집합으로 묶은 **객체 군**을 구현화 하는 생성 패턴

※ 군 ⇒ 브랜드명 이라고 생각하면 이해하기 쉬움

생성된 객체(제품)의 타입을 클라이언트로부터 숨기고, 서로 연관된 객체들을 함께 사용할 수 있도록 함

즉 클라이언트에서 특정 객체를 사용할 때 팩토리 클래스만을 참조하여 특정 객체에 대한 구현부를 감추어 역할과 구현을 분리시킬 수 있다.

💡 추상 팩토리의 핵심은 제품군 집합을 **타입 별로 찍어낼 수 있다**는 점이 포인트

> 예를 들어, 모니터와 마우스와 키보드를 묶은 전자 제품군이 있는데 이들을 또 삼성 제품군군이냐 애플 제품군이냐에 따라 집합이 브랜드명으로 여러 갈래로 나뉘게 될 때, 복잡하게 묶이는 이러한 제품군들을 관리와 확장하기 용이하게 패턴화 한 것
> 

## 추상 팩토리**의 주요 구성 요소 및 작성 순서**

1. **Abstract Product** : 각 타입의 제품들을 추상화한 인터페이스
    
    ```jsx
    interface Button {
      renderButton(): void;
    }
    
    interface Checkbox {
      renderCheckbox(): void;
    }
    ```
    

1. **Concrete Product (ProductA ~ ProductB)** : 각 타입의 제품 구현체들
    
    ```jsx
    class WindowsButton implements Button {
      renderButton() {
        console.log("Rendering a Windows button");
      }
    }
    
    class MacButton implements Button {
      renderButton() {
        console.log("Rendering a Mac button");
      }
    }
    
    class WindowsCheckbox implements Checkbox {
      renderCheckbox() {
        console.log("Rendering a Windows Checkbox");
      }
    }
    
    class MacCheckbox implements Checkbox {
      renderCheckbox() {
        console.log("Rendering a Mac Checkbox");
      }
    }
    ```
    

1. **Abstract Factory** : 여러 개의 제품들을 생성하는 여러 메소드를 추상화
    
    ```jsx
    interface UIFactory {
      createButton(): Button;
      createCheckbox(): Checkbox;
    }
    ```
    

1. **Concrete Factory** : 서브 공장 클래스들은 타입에 맞는 제품 객체들 반환하도록 메소드들을 재정의
    
    ```jsx
    class WindowsUIFactory implements UIFactory {
      createButton(): Button {
        return new WindowsButton();
      }
      createCheckbox(): Checkbox {
        return new WindowsCheckbox();
      }
    }
    
    class MacUIFactory implements UIFactory {
      createButton(): Button {
        return new MacButton();
      }
      createCheckbox(): Checkbox {
        return new MacCheckbox();
      }
    }
    ```
    

1. **Client (클라이언트)**
    
    1️⃣ 클래스로 구현 - 1
    
    ```typescript
    class Application {
      private factory: UIFactory
    
      constructor(factory: UIFactory) {
        this.factory = factory
      }
    
      createUI(): void {
        const button = this.factory.createButton();
        const checkbox = this.factory.createCheckbox();
    
        button.renderButton();
        checkbox.renderCheckbox();
      }
    }
    
    const winFactory = new WinFactory();
    const macFactory = new MacFactory();
    
    console.log('Creating UI for Windows:');
    const windowsApp = new Application(winFactory);
    windowsApp.createUI();
    
    console.log('\nCreating UI for macOS:');
    const macApp = new Application(macFactory);
    macApp.createUI();
    
    // Creating UI for Windows:
    // Rendering a Windows button
    // Rendering a Windows Checkbox
    
    // Creating UI for macOS:
    // Rendering a Mac button
    // Rendering a Mac Checkbox
    ```
    
    - `factory`라는 인스턴스 변수를 선언하고, 접근 제어자로서 `private`를 사용하여 해당 변수를 클래스 외부에서 접근할 수 없도록 제한한다.
    - `factory` 변수를 `constructor`의 매개변수로 전달함으로써 클래스 내부 전체에서 사용할 수 있다.

    </br>
    
    2️⃣ 클래스로 구현 - 2 : main함수를 추가
    
    ```jsx
    class Application {
      private factory: UIFactory;
    
      constructor(factory: UIFactory) {
        this.factory = factory;
      }
    
      createUI(): void {
        const button = this.factory.createButton();
        const checkbox = this.factory.createCheckbox();
    
        button.renderButton();
        checkbox.renderCheckbox();
      }
    
      public static main(): void {
        console.log("Creating UI for Windows:");
        const windowsClient = new Application(new WindowsUIFactory());
        windowsClient.createUI();
    
        console.log("\nCreating UI for macOS:");
        const macClient = new Application(new MacUIFactory());
        macClient.createUI();
      }
    }
    
    Application.main();
    
    // Creating UI for Windows:
    // Rendering a Windows button
    // Rendering a Windows Checkbox
    
    // Creating UI for macOS:
    // Rendering a Mac button
    // Rendering a Mac Checkbox
    ```
    
    - 위와 같이 팩토리 타입을 변경할 필요성이 있을 때 계속 new로 초기화하면 GC에 부담이 된다.
    - 이를 해결하기 위해 각 팩토리 클래스들을 싱글톤화 시켜 메모리를 최적화 시킬 수 있다.

## 추상화 패턴 장점

- 객체를 생성하는 코드를 분리하여 클라이언트 코드와 결합도를 낮출 수 있다
- 제품 군을 쉽게 대체할 수 있다
- **단일 책임 원칙 준수**
- **개발/폐쇄 원칙 준수**

## 추상화 패턴 단점

- 각 구현체마다 팩토리 객체들을 모두 구현해주어야 하기 때문에 객체가 늘어날 때마다 클래스가 증가하여 복잡성이 증가 (팩토리 패턴의 공통적인 문제점)
- 기존 추상 팩토리의 세부사항이 변경되면 모든 팩토리에 대한 수정이 필요
- 새로운 종류의 제품을 지원하는 것이 어려움. 새로운 제품이 추가되면 팩토리 구현 로직 자체를 변경해야함

## 추상화 패턴 흐름 및 구분 한눈에 보기

> Button → Abstract ProductA      
> **WindowsButton → Concrete ProductA1**   
> **MacButton → Concrete ProductA2**    
> **WindowsUIFactory → ConcreteFactory1**   
>
> Checkbox → Abstract ProductB     
> **WindowsCheckbox → Concrete ProductB1**    
> **MacCheckbox → Concrete ProductB2**    
> **MacUIFactory → ConcreteFactory2**    
>   
> UIFactory → AbstractFactory

![Untitled (3)](https://github.com/snghyun331/study-cs/assets/108854903/23687068-7c1a-467d-9d50-6eab004e7260)
- 컴퓨터 화면에 컴포넌트 요소들(버튼, 체크박스)을 화면에 그리는 로직을 구현한다고 가정
- 2가지 객체들(Button, Checkbox)은 하나의 컴포넌트 군으로 묶을 수 있으며, 또한 OS별 군으로 나뉘게 될 수 있다.
    - 컴포넌트 군 (WindowButton, MacButton) (WindowCheckbox, MacCheckbox)
    - OS 군 (WindowButton, WIndowCheckbox) (MacButton, MacCheckbox)

**⇒ 제품 군 집합을 타입 별로 찍어낼 수 있다!**

</br>

# **팩토리 메서드 VS 추상화 팩토리**

- 팩토리 메서드 : 어떤 객체를 생성할지에 집중
- 추상 팩토리: 연관된 객체를 모아두는 것에 집중
- [**이 블로그**](https://velog.io/@from_numpy/Typescript-디자인-패턴-추상화-팩토리-vs-팩토리-메서드) 를 참조하면 이해하기 쉬울 것이다.
    - 나중에 한번 정리를 ..!

## 팩토리 메서드 패턴으로 구현

- 공장 객체는 **한가지 종류의 컴포넌트**만 생성하는 구조
- 추상화된 팩토리 메서드를 각 서브 공장 클래스가 재정의하여 걸맞는 제품 객체를 생성
    
    → 그렇기 때문에 어느 OS실행환경인지는 분기문을 통해 구분해야함
    
- 만약 Linux를 새로 추가한다고 할 때, 모든 팩토리 클래스의 메서드(분기문 로직)를 일일히 수정해야해서 OCP원칙에 위배됨
- 아래 예시는 팩토리 클래스를 컴포넌트별로 구현함

![Untitled (4)](https://github.com/snghyun331/study-cs/assets/108854903/2b42ec09-bb0b-4a4f-a2ea-7ee7d01fb232)

## 추상 팩토리 패턴으로 구현

- 추상 팩토리의 공장 객체는 하나의 객체에서 **여러 종류의 컴포넌트들**을 골라 생산할 수 있음
- 아래 예시는 팩토리 클래스를 OS별로 구현함

![Untitled (5)](https://github.com/snghyun331/study-cs/assets/108854903/68fb1ce4-e7b6-464c-bc4a-5969a4c3370e)
※ 그림 출처: 인파 Dev

</br>

## **References**
https://bcp0109.tistory.com/367

[https://inpa.tistory.com/entry/GOF-💠-팩토리-메서드Factory-Method-패턴-제대로-배워보자](https://inpa.tistory.com/entry/GOF-%F0%9F%92%A0-%ED%8C%A9%ED%86%A0%EB%A6%AC-%EB%A9%94%EC%84%9C%EB%93%9CFactory-Method-%ED%8C%A8%ED%84%B4-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EB%B0%B0%EC%9B%8C%EB%B3%B4%EC%9E%90)
