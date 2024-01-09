interface Channel {
  subscribe(observer: Subscriber): void;
  unSubscribe(observer: Subscriber): void;
  notifySubscribers(): void;
}

class CookingChannel implements Channel {
  private subscribers: Subscriber[] = [];
  private latestVideo: any;

  // 비디오 업로드 메서드
  uploadVideo(newVideo: any): void {
    this.latestVideo = newVideo;
    this.notifySubscribers();
  }

  // 구독자 등록
  subscribe(observer: Subscriber): void {
    this.subscribers.push(observer);
    console.log(observer + "구독 완료");
  }

  // 구독자 해지
  unSubscribe(observer: Subscriber): void {
    const index = this.subscribers.indexOf(observer);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }

    console.log(observer + "구독 취소");
  }

  notifySubscribers(): void {
    for (const subscriber of this.subscribers) {
      subscriber.update(this.latestVideo);
    }
  }
}

interface Subscriber {
  update(video: any): void;
}

class Subscriber1 implements Subscriber {
  private subscriberVideo: any;

  update(video: any): void {
    this.subscriberVideo = video;
    console.log(`구독자1에게 영상 업로드 알림이 왔습니다. 제목: ${this.subscriberVideo.title}`);
  }
}

const channel = new CookingChannel();
const subscriber1 = new Subscriber1();

// 구독 후 비디오 업로드
channel.subscribe(subscriber1);
channel.uploadVideo({ title: "컵케이크 만들기", views: 1000 });

// 구독 해지 후 비디오 업로드
channel.unSubscribe(subscriber1);
channel.uploadVideo({ title: "감자빵 만들기", views: 800 });
