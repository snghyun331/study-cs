# 옵저버 패턴

✔ 어떤 객체의 상태가 변할 때 그 객체에 종속된 다수의 객체들에게 알려주는 디자인 패턴

✔ 옵저버(관찰자)들이 관찰 대상자의 상태 변화를 관찰하고, 변화가 있을 때마다 대상자는 목록의 각 관찰자들에게 통지하고 관찰자들은 알림을 받아 조치를 취하는 행동 패턴

✔ 주로 이벤트 기발 시스템에 사용됨

✔ MVC패턴에도 사용됨

- Model과 View의 관계는 Subject 역할과 Observer의 관계에 대응됨
- 하나의 Model에 복수의 View가 대응함

</br>

**실생활에서의 옵저버 패턴 예시 - 유튜브**

유튜브 채널에 영상을 올리면 여러 명의 구독자들은 모두 영상이 올라왔다는 알림을 받는다. 이를 패턴 구조로 보면, 구독자들은 해당 채널을 구독함으로써 채널에 어떠한 변화가 생기게 되면 바로 연락을 받아 탐지하는 것이다.

</br>

1. **주제(Subject) :** (관찰)대상자를 정의하는 인터페이스
    - 상태가 변경되는 객체이며, 옵저버에게 변경 사항을 알리는 책임이 있다
    - 예) 유튜브 채널
    - 등록/삭제/알림 반드시 있어야 함

    ```tsx
    interface Channel {
      subscribe(observer: Subscriber): void;
      unSubscribe(observer: Subscriber): void;
      notifySubscribers(): void;
    }
    ```
    </br>

2. **옵저버(Observer)** : 주체의 상태 변화를 감시하고 이에 대응하는 행동을 정의
    - 주체의 상태가 변경될 때마다 알림을 받는 역할 = **관찰자**
    - 예) 구독자 모음

    ```tsx
    // 옵저버(Observer) 인터페이스
    interface Subscriber {
      update(video: any): void;   
    }
    ```
    </br>

3. **구체적인 주체(Concrete Subject)** : 관찰을 당하는 대상자
    - 상태가 변경되거나 동작을 실행할 때, 모든 옵저버에게 알림(notify)을 보냄
    - 옵저버들을 리스트로 모아 합성하여 가지고 있다

    ```tsx
    class CookingChannel implements Channel {
      private subscribers: Subscriber[] = [];
      private latestVideo: any;
    
      // 비디오 업로드 
      uploadVideo(newVideo: any): void {
        this.latestVideo = newVideo;
        this.notifySubscribers();
      }
    
      // 구독 등록 (push 이용하여 리스트에 추가)
      subscribe(observer: Subscriber): void {
        this.subscribers.push(observer);
        console.log(observer + "구독 완료");
    		// console.log(this.subscribers)  =>  [ Subscriber1 {} ]
      }
    
      // 구독 해지 (remove 관련 함수가 제공되지 않아 indexOf 이용하여 삭제)
      unSubscribe(observer: Subscriber): void {
        const index = this.subscribers.indexOf(observer);
        if (index !== -1) {
          this.subscribers.splice(index, 1);
        }
        console.log(observer + "구독 취소");
      }
    
      // 구독자에게 비디오 업로드 알림 (관찰자 리스트를 순회)
      notifySubscribers(): void {
        for (const subscriber of this.subscribers) {
          subscriber.update(this.latestVideo);
        }
      }
    }
    ```

    - `Subscriber[] = []` : 옵저버인 subscriber들을 리스트로 가지기 위해 Subscriber 인터페이스의 배열로 초기화하였다
    </br>

1. **구체적인 옵저버(Concrete Observer)** 
    - Subject가 보낸 알림에 대해 현재 상태를 취득
    - 예) 구독자1

    ```tsx
    class Subscriber1 implements Subscriber {
      private subscriberVideo: any;
    	
      // 이벤트 송신 메서드
      update(video: any): void {
        this.subscriberVideo = video;
        console.log(`구독자1에게 영상 업로드 알림이 왔습니다. 제목: ${this.subscriberVideo.title}`);
      }
    }
    ```
    </br>

2. **클라이언트**
    
    ```tsx
    const channel = new CookingChannel();
    const subscriber1 = new Subscriber1();
    
    // 구독 후 비디오 업로드
    channel.subscribe(subscriber1);
    channel.uploadVideo({ title: "컵케이크 만들기", views: 1000 });
    
    // 구독 해지 후 비디오 업로드
    channel.unSubscribe(subscriber1);
    channel.uploadVideo({ title: "감자빵 만들기", views: 800 });
    
    // [object Object]구독 완료
    // 구독자1에게 영상 업로드 알림이 왔습니다. 제목: 컵케이크 만들기
    // [object Object]구독 취소
    ```
    
</br>
</br>

> 종합해보면, 핵심은 합성한 객체를 **리스트로 관리**하고 리스트에 있는 **관찰자 객체들에게 모두** 메서드 위임을 통한 전파 행위를 한다는 점을 기억하자!
> 
</br>

## 장점

- Subject의 상태 변화를 **주기적으로 조회하지 않고 자동으로 감지**할 수 있다.
- 대상자의 코드를 변경하지 않고도 새 구독자 클래스를 도입할 수 있어 OCP 원칙을 준수함
- 런타임 시점에서에 대상자와 구독 알림 관계를 맺을 수 있다.
- 상태를 변경하는 객체(Subject)와 변경을 감지하는 객체(Observer)의 관계를 느슨하게 유지할 수 있다. (느슨한 결합)

## 단점

- 구독자는 알림 순서를 제어할수 없고, 무작위 순서로 알림을 받음
- 다수의 옵저버 객체를 등록 이후 해지하지 않는다면 메모리 누수가 발생할 수도 있다.

</br>

## ⭐옵저버 패턴 흐름 정리

1. 한 개의 관찰 대상자(Subject)와 여러 개의 관찰자(Observer A, B, C)로 **일 대 다 관계**로 구성되어 있다
2. 관찰 대상 Subject의 상태가 바뀌면 변경사항을 옵저버한테 통보해준다. (**notifyObserver**)
3. 대상자로부터 통보를 받은 Observer는 값을 수정, 삭제 등 적절히 대응한다. (**update**)
4. 또한 Observer들은 언제든 Subject의 그룹에서 추가/삭제 될 수 있다. Subject 그룹에 추가되면 Subject로부터 정보를 전달받게 될 것이며, 그룹에서 삭제될 경우 더이상 Subject의 정보를 받을수 없게 된다.
![Untitled](https://github.com/snghyun331/study-cs/assets/108854903/2c8c63ee-9894-4f6a-88d8-890fc1e86832)


</br>

## References

[인파 Dev](https://inpa.tistory.com/entry/GOF-%F0%9F%92%A0-%EC%98%B5%EC%A0%80%EB%B2%84Observer-%ED%8C%A8%ED%84%B4-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EB%B0%B0%EC%9B%8C%EB%B3%B4%EC%9E%90)
