interface User {
  signup(): void;
}

class NaverUser implements User {
  constructor(private name: string) {}
  signup(): void {
    console.log(`네이버 아이디로 가입: 닉네임은 ${this.name}`);
  }
}

class KakaoUser implements User {
  constructor(private name: string) {}
  signup(): void {
    console.log(`카카오 아이디로 가입: 닉네임은 ${this.name}`);
  }
}

interface UserFactory {
  newInstance(name: string): User;
  createUser(name: string): User;
}

class NaverUserFactory implements UserFactory {
  newInstance(name: string): User {
    const user = this.createUser(name);
    user.signup();
    return user;
  }

  createUser(name: string): User {
    return new NaverUser(name);
  }
}

class KakaoUserFactory implements UserFactory {
  newInstance(name: string): User {
    const user = this.createUser(name);
    user.signup();
    return user;
  }

  createUser(name: string): User {
    return new KakaoUser(name);
  }
}

const naverFactory = new NaverUserFactory();
const kakaoFactory = new KakaoUserFactory();

const naverUser = naverFactory.newInstance("Naver!");
const kakaoUser = kakaoFactory.newInstance("Kakao!");

// 네이버 아이디로 가입: 닉네임은 Naver!
// 카카오 아이디로 가입: 닉네임은 Kakao!
