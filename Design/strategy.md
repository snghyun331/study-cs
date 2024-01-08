# 전략 패턴

- 런타임(실행) 중에 알고리즘 전략을 **선택**하여 객체 동작을 실시간으로 바꿀 수 있는 **행위** 디자인 패턴
- 알고리즘군을 정의하고 각각 캡슐화하여 교환할 수 있게 만드는 패턴

어떤 일을 수행하는 알고리즘이 **여러가지** 일 경우, 동작들을 미리 전략으로 정의함으로써 손쉽게 전략을 교체할 수 있다. 따라서 **알고리즘 변형이 빈번하게 필요한 경우**에 적합

알고리즘을 사용하는 클라이언트와 알고리즘을 구현하는 클래스로 분리된다.

변하지 않는 부분을 `Context` 에 두고 변하는 부분을 `Strategy` 인터페이스의 구현체에 작성한다.
## 전략 패턴의 주요 구성 요소

1. **Strategy :** 전략 인터페이스
2. **Concrete Strategy(구체적인 전략)** : 전략 인터페이스를 실제로 구현하는 클래스. 알고리즘, 행위, 동작을 객체로 정의하고 구현한다.
3. **Context** : 알고리즘을 실행할 때마다 해당 알고리즘과 연결된 전략 객체의 메소드를 호출한다. 

```tsx
// 전략 인터페이스
interface PaymentStrategy {
  perform(money: number): void;
}

// 구체적인 전략 클래스 1
class CreditCardPayment implements PaymentStrategy {
  perform(money: number): void {
    console.log(`카드 결제가 성공하였습니다: ${money}원`);
  }
}

// 구체적인 전략 클래스 2
class CashPayment implements PaymentStrategy {
  perform(money: number): void {
    console.log(`현금 결제가 성공하였습니다: ${money}원`);
  }
}

// Context 클래스 (공통된 부분)
class PaymentContext {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  // 전략 변경 메서드
  setPaymentStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  // 클라이언트에게 제공되는 메서드
  makePayment(money: number): void {
    this.strategy.perform(money);
  }
}
```

- `perform()` : 결제에 필요한 동작을 수행하는 메소드
- `CreditCardPayment`와 `CashPayment` 클래스는 `perform` 메서드를 구현하여 해당 결제 수단에 맞게 동작한다.
- `PaymentContext` 클래스
    - `PaymentContext` 클래스는 전략을 사용하는 클라이언트에게 필요한 인터페이스를 제공
    - `setStrategy` 메서드를 통해 동적으로 전략을 변경할 수 있다.
    - `makePayment` 메서드는 **현재 선택된 전략에 따라** 결제를 수행한다.
- PaymentContext 클래스에서 결제를 진행하지 않고, 결제가 이루어지는 부분을 PaymentStrategy에 위임하게 됨으로써 PaymentContext 클래스는 어떤 방식으로 결제를 하게 되는지 알 필요가 없어졌다.

4. **Client** : 전략 객체를 Context에 전달함으로써 동적으로 전략을 등록하거나 변경하여 전략 알고리즘을 실행한 결과를 누린다.
    
    ```tsx
    // Client
    const creditCardPayment = new CreditCardPayment();
    const cashPayment = new CashPayment();
    
    const paymentContext = new PaymentContext(creditCardPayment);
    paymentContext.makePayment(100); 
    // 출력: 카드 결제가 성공하였습니다: 100원
    
    paymentContext.setPaymentStrategy(cashPayment);  // 현금 결제 전략으로 변경
    paymentContext.makePayment(50); 
    // 출력: 현금 결제가 성공하였습니다: 50원
    ```
    
    - `CreditCardPayment`와 `CashPayment` 인스턴스를 생성한다.
    - 초기에는 `CreditCardPayment`전략으로 PaymentContext를 생성하여 makePayment 메서드를 통해 카드 결제가 수행된다.
    - 이후 setPaymentStrategy메서드로 현금 결제 전략으로 변경하여 다시 `makePayment`를 호출하면 현금 결제가 수행됩니다.
    
    **+만약 main함수를 만들고 Client 코드를 클래스로 감싸고 싶으면….**
     ```typescript
    class PaymentClient {
      static main(): void {
        const creditCardPayment = new CreditCardPayment();
        const cashPayment = new CashPayment();
    
        const paymentContext = new PaymentContext(creditCardPayment);
        paymentContext.makePayment(100);
    
        paymentContext.setPaymentStrategy(cashPayment);
        paymentContext.makePayment(50);
      }
    }
    
    PaymentClient.main();
    // 카드 결제가 성공하였습니다: 100원
    // 현금 결제가 성공하였습니다: 50원
     ```
</br>

## 전략 패턴 흐름 한눈에 보기
![Untitled](https://github.com/snghyun331/study-cs/assets/108854903/23a1792c-7e98-4ceb-862b-fa422e4c623e)




**<확장 방법>**

Concrete Strategy부분에서 기존 인터페이스나 다른 구현체 변경 없이 새로운 비즈니스 로직(구현체)을 추가하기만 하면 된다.

</br>

## 전략 패턴 사용 시기

- 전략 알고리즘의 여러 버전 또는 변형이 필요할 때 클래스화를 통해 관리
- 알고리즘 동작이 런타임에 실시간으로 교체되어야 할 때

</br>

> 종합해보면, 이전 코드는 어떤 결제 방식을 선택했는지 분기 처리를 통해 처리해야했지만 전략 패턴을 사용함으로써 PaymentStrategy 인터페이스를 구현한 다양한 결제 전략 클래스(구현체)를 실행 시점에 PaymentContext 클래스에 지정해주게 되면 각 구현체에 맞는 결제 전략으로 결제하도록 처리할 수 있다.
> 
> 어떤 결제 방식이 추가된다고 해도 PaymentContext 클래스에 변경을 가져오지 않고 **결제 전략을 변경**하는 것으로 기능을 추가할 수 있게 되어 OCP를 위반하지 않는다.

</br>

## Passport의 전략 패턴

- Node.js의 Passport라이브러리는 전략 패턴을 활용한 대표적인 라이브러이이다.
- passport는 인증 모듈을 구현할 때 쓰이고, 여러가지 전략을 기반으로 인증할 수 있음

**@nest/passport을 이용한 NestJs에서의 인가처리**

```tsx
// 엑세스 토큰 인증 전략
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access') {
  async validate(req: Request) {
    ....

// 리프레쉬 토큰 인증 전략
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  async validate(req: Request) {
    ....
```

**Express에서의 OAuth로그인 인증 전략**

```jsx
const passport = require('passport'); 
const KakaoStrategy = require('passport-kakao').Strategy; 
const NaverStrategy = require('passport-naver-v2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// 카카오 로그인 전략 등록
passport.use(new KakaoStrategy({ clientID, callbackURL }, async (accessToken, refreshToken, profile, done) => {
	// ...
});

// 네이버 로그인 전략 등록
passport.use(new NaverStrategy({ clientID, clientSecret, callbackURL }, async (accessToken, refreshToken, profile, done) => {
	// ...
});

// 구글 로그인 전략 등록
passport.use(new GoogleStrategy({ clientID, clientSecret, callbackURL }, async (accessToken, refreshToken, profile, done) => {
	// ...
});
```
</br>
</br>

## **References**

[https://velog.io/@ch4570/전략-패턴Strategy-Pattern-어떻게-적용할-수-있을까](https://velog.io/@ch4570/%EC%A0%84%EB%9E%B5-%ED%8C%A8%ED%84%B4Strategy-Pattern-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%A0%81%EC%9A%A9%ED%95%A0-%EC%88%98-%EC%9E%88%EC%9D%84%EA%B9%8C)

[인파 Dev](https://inpa.tistory.com/entry/GOF-%F0%9F%92%A0-%EC%A0%84%EB%9E%B5Strategy-%ED%8C%A8%ED%84%B4-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EB%B0%B0%EC%9B%8C%EB%B3%B4%EC%9E%90)
