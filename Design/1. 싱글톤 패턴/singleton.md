**디자인 패턴이란?**

프로그램을 설계할 때 발생하는 문제점들을 (객체 간의 상호관계 등을 이용하여) 해결할 수 있도록 하나의 ‘규약’ 형태로 만들어 놓은 것

# 싱글톤 패턴

- 하나의 클래스에 오직 하나의 인스턴스만 가지는 패턴 (하나의 유일한 객체만 생성하는 목적)
- 하나의 인스턴스를 만들어 놓고 해당 인스턴스를 다른 모듈들이 공유하며 사용. 즉, 똑같은 인스턴스를 **새로 만들지 않고 기존의 인스턴스를 가져와** 활용하는 기법

> “우리가 **전역**변수 라는 걸 만들어 이용하는 이유는, 똑같은 데이터를 메서드마다 지역 변수로 선언해서 사용하면 낭비이기 때문에, 전역에서 한번한 데이터를 선언하고 가져와 사용하면 효율적이다.”
> 

이러한 개념을 그대로 클래스에 대입한 것이 싱글톤 패턴이다.

보통 싱글톤 패턴이 적용된 객체가 필요한 경우는 그 객체가 리소스를 많이 차지하는 역할을 하는 무거운 클래스일 때 적합하다.

※ static을 사용하면 메모리 낭비가 있을 수 있음

## 자바스크립트의 싱글톤

1. **Module Pattern**
    
    ```jsx
    interface IPerson {
      name: string;
      age: number;
      greeting: VoidFunction;
    }
    
    const Person = (function () {
      let instance: IPerson | undefined;  // private 변수
    
      function createInstance(): IPerson {
        return {
          name: 'jacob',
          age: 30,
          greeting: function () {
            return `Hi! ${this.name}`;
          },
        };
      }
      return {
        getInstance: function () {
          if (instance === undefined) {
            instance = createInstance();
          }
          return instance;
        },
      };
    })();
    ```
    
    - `Person`은 즉시 실행 함수(IIFE)를 사용하여 모듈 패턴을 구현한 것
    - `instance` 변수는 코드 내부에 private하게 정의되어있고, 인스턴스가 한번만 생성되고 나면 이 변수에 저장된다.
    - `createInstance` 함수는 private하며, 새로운 인스턴스를 만드는 주체이다. 클래스의 생성자 역할을 하며 인스턴스를 초기화한다.
    - `getInstance` 함수는 싱글톤 패턴의 핵심. 이미 생성된 인스턴스가 있는지 확인하고, 없다면 createInstance를 호출하여 새로운 인스턴스를 생성
        - 이미 생성된 인스턴스가 있으면 그것을 반환하고, 없으면 생성하여 반환한다.
        - 이렇게 하면 애플리케이션 전체에서 하나의 인스턴스만을 사용할 수 있다
           
    ```jsx
    // Usage
    const jacob1 = Person.getInstance();
    const jacob2 = Person.getInstance();
    
    console.log(jacob1 === jacob2); // true
    ```
    
    - `Person.getInstance()`를 호출하여 인스턴스를 얻는다. 이 때, **처음 호출할 때만 새로운 인스턴스를 생성하고, 그 이후에는 기존에 생성된 인스턴스를 반환**
    - `jacob1`과 `jacob2`는 동일한 인스턴스를 참조하므로 `true`가 출력된다.
    

    > 종합하면, 코드는 단일한 객체를 만들기 위한 패턴으로 구성되어 있다. 이 객체는 **`IPerson`** 인터페이스를 따르며, **한 번 생성되면 애플리케이션 전체에서 공유되고 재사용된다**. 따라서 주어진 코드는 싱글톤 패턴을 구현하고 있다.
    > 

1. **ES6 Class**
    
    DB Connection처럼 한 시스템에서 매번 Connection을 연결할 필요가 없을 때 
    
    ```jsx
    const URL = 'mongodb://localhost:27017/kundolapp';
    const URL2 = 'mongodb://localhost:27017/kundolapp222';
    
    const createConnection = (url) => ({ url: url });
    
    class DB {
    	constructor(url) {
    		if (!DB.instance) {
    			DB.instance = createConnection(url);
    		}
    		return DB.instance;
    	}
    	connect() {
    		return this.instance;
    	}
    }
    ```
    
    - 생성자에서 인스턴스가 이미 존재하는지 확인하고, 없다면 새로운 인스턴스를 생성하여 반환한다. 이로써 `a`와 `b`가 `DB` 클래스의 인스턴스를 생성하더라도 항상 같은 인스턴스를 참조하게 된다.
    - `DB.instance`: 클래스의 정적 멤버로서, 생성된 인스턴스를 저장하는 프로퍼티.
    - `constructor(url)`: 생성자에서는 인스턴스가 없는 경우에만 새로운 인스턴스를 생성하고, 이미 있는 경우에는 기존의 인스턴스를 반환한다.
    - `connect()`: 단순히 현재의 인스턴스를 반환하는 메서드.
    
    ```jsx
    // Usage
    const a = new DB(URL);
    const b = new DB(URL2);
    console.log(a);  // { url: 'mongodb://localhost:27017/kundolapp' }
    console.log(b);  // { url: 'mongodb://localhost:27017/kundolapp' }
    console.log(a === b); // true
    ```
    
    싱글톤 패턴의 특징에 따라 a와 b는 동일한 인스턴스를 참조하기 때문에 같은 결과를 출력한다.
    
2. **Object Literal**

    ```jsx
    const createDB = (url) => {
      let instance;
    
      const connect = () => instance;
    
      return {
        getInstance: () => {
          if (!instance) {
            instance = { url: url };
          }
          return instance;
        },
        connect: connect,
      };
    };
    
    // 예제에서 DB 객체 생성
    const dbA = createDB('mongodb://localhost:27017/kundolapp');
    const dbB = createDB('mongodb://localhost:27017/kundolapp222');
    
    console.log(dbA.getInstance()); // { url: 'mongodb://localhost:27017/kundolapp' }
    console.log(dbB.getInstance()); // { url: 'mongodb://localhost:27017/kundolapp' }
    
    console.log(dbA.getInstance() === dbB.getInstance()); // true 
    ```
## NestJs의 싱글톤

✅ 싱글톤은 패턴은 모듈 간의 결합을 강하게 만들 수 있다는 단점이 있다.

✅ NestJs에서는 이를 해결하기 위해 `@Injectable`을 이용한 **의존성 주입(DI)**을 통해 모듈 간의 결합을 조금 더 느슨하게 만들어준다.

- **의존성 주입(DI)**
    
    ![Untitled](https://github.com/snghyun331/study-cs/assets/108854903/23de4259-b964-4254-bb3f-921ccf4c8311)
    
    **“A가 B에 의존성이 있다”** → B의 변경사항에 대해 A 또한 변해야한다.
    
    위 그림처럼 메인 모듈이 ‘직접’ 다른 하위 모듈에 대한 의존성을 주기보다는, 중간에 의존성 주입자가 이 부분을 가로채 메인 모듈이 ‘**간접’**적으로 의존성을 주입하는 방식
    
    이를 통해 메인모듈(상위 모듈)은 하위 모듈에 대한 의존성이 떨어지게 됨
    

✅ 하나의 인스턴스를 global 하게 사용할 수도 집약적으로 사용할 수 있다. global 하게 사용한다면 A클래스에서 B클래스에서 사용하는 인스턴스에 접근을 방지 하기 위해 private 을 선언해주는 방법도 있다.

싱글톤을 구현하기 위해서는 `@Injectable(), @Module()` 데코레이터를 사용한다. 해당 데코레이터를 선언하면, 해당 인스턴스를 nest 내장 IOC container 가 관리한다

(데코레이터가 달린 클래스는 타입스크립트가 컴파일시 메타데이터로 어떤 서비스에 의존하고 있는지 명시를 해준다. 그러면 nestjs 가 어떤 의존관계가 있는지 알 수 있다.)

👉 **nest 내부의 IOC container 가 @Injectable(), @Module() 데코레이터 클래스를 싱글톤으로 생성하여 DI의 대상으로 관리한다.**

```jsx
@Injectable()
export class PostsService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private postsRepository: PostsRepository,
    private dataSource: DataSource,
  ) {}

  async createPost(createUserDto, userId) {
    const queryRunner = this.dataSource.createQueryRunner();
    ....
}
```

- 위 코드는 NestJS에서 사용되는 서비스(**`PostsService`**)로, 싱글톤 패턴을 사용한다. NestJS에서 **`@Injectable()`** 데코레이터를 사용하면 해당 서비스가 싱글톤으로 관리되도록 된다. 따라서 **`PostsService`** 클래스는 애플리케이션 전체에서 하나의 인스턴스만을 갖게 된다.
- 예를 들어 PostService가 imports, providers 두 군데로 주입되어도 싱글톤으로 생성이 된다.

> 종합해보면, NestJS에서 의존성 주입은 싱글톤 패턴을 자동으로 적용해주는 것으로 이해할 수 있다. 따라서 개발자가 인스턴스를 직접 생성하는 것이 아니라 **모듈을 주입하는 과정을 통해 nestjs가 알아서 싱글톤 인스턴스를 생성하는 것이다.**
>

---

## References

[Inpa Dev](https://inpa.tistory.com/entry/GOF-💠-싱글톤Singleton-패턴-꼼꼼하게-알아보자)

https://ajdkfl6445.gitbook.io/study/typescript/singleton-pattern

[https://velog.io/@pptrolldev/Javascript-ES6-생성-패턴](https://velog.io/@pptrolldev/Javascript-ES6-%EC%83%9D%EC%84%B1-%ED%8C%A8%ED%84%B4)

https://velog.io/@leejm_dev/nestjs-singleton
