var dog,sadDog,happyDog;
var lastFed=0;

function preload(){
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
}

function setup() {
  createCanvas(1000,400);
  database=firebase.database()
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  foodObj=new Food()
  foodStock=database.ref("food")
  foodStock.on("value",readStock)

  feed=createButton("feed the dog")
  feed.position(700,95)
  feed.mousePressed(feedDog)
  addFood=createButton("add Food")
  addFood.position(800,95)
  addFood.mousePressed(addFoods)
}

function draw() {
  background(46,139,87);
  foodObj.display()
  feedTime=database.ref("feedtime")
  feedTime.on("value",function(data){
    lastFed=data.val()
  })
  fill("black")
  textSize(20)
  if(lastFed>=12){
    text("last Feed"+lastFed%12+"pm",350,30)
  }else if(lastFed===0){
    text("last Feed 12am",350,30)
  }else{text("last Feed"+lastFed+"am",350,30)}

  drawSprites();
}

//function to read food Stock
function readStock(data){
  foods=data.val()
  foodObj.updateFoodStock(foods)
}

//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog)
  if (foodObj.getFoodStock()<0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0)
  }else {
   foodObj.updateFoodStock(foodObj.getFoodStock()+1)
  }
  database.ref("/").update({
    food:foodObj.getFoodStock(),
    feedtime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foods++
  database.ref("/").update({
    food:foods
  })
}