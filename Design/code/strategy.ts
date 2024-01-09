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

// Client
const creditCardPayment = new CreditCardPayment();
const cashPayment = new CashPayment();

const paymentContext = new PaymentContext(creditCardPayment);
paymentContext.makePayment(100); // 출력: 카드 결제가 성공하였습니다: 100원

paymentContext.setPaymentStrategy(cashPayment);
paymentContext.makePayment(50); // 출력: 현금 결제가 성공하였습니다: 50원
