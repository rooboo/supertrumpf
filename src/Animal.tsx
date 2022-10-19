export default class Animal {
  name: string;
  image: string;
  size: number;
  weight: number;
  age: number;
  offspring: number;
  speed: number;
  constructor(name: string, image: string, size: number, weight: number, age: number, offspring: number, speed: number) {
    this.name = name;
    this.image = image;
    this.size = size;
    this.weight = weight;
    this.age = age;
    this.offspring = offspring;
    this.speed = speed;
  }

}
