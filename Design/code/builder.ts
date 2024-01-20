class Hamburger {
  size: string;
  cheese: number;
  tomato: number;
  pickles: number;

  constructor(size: string) {
    this.size = size;
  }
}


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

const burger = new HamburgerBuilder('Large')
		.addCheese(1)
		.addTomato(2)
		.addPickles(3)
		.build();

console.log(burger); 
