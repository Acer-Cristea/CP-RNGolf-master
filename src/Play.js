class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X_MIN = 100
        this.SHOT_VELOCITY_X_MAX = 300
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100

    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {

        this.ui_config = {
            fontFamily: "Comic Sans MS",
            fontSize: "20px",
            color: "#000000",
            align: "right",
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 0
          }


        this.score = 0
        this.shotCounter = 0
        this.shotPerc = 0
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)
        this.scoreText = this.add.text(width/20, height/25, `Score: ${this.score}`, this.ui_config)
        this.shotCounterText = this.add.text(width / 20, height / 15, `Shots: ${this.shotCounter}`, this.ui_config);
        this.shotPercText = this.add.text(width / 20, height / 10, `Shot Percent: ${this.shotPerc}%`, this.ui_config);

        // add cup
        this.cup = this.physics.add.sprite(width/2, height/10, "cup")
        this.cup.body.setCircle(this.cup.width/4)
        this.cup.body.setOffset(this.cup.width /4)
        this.cup.body.setImmovable(true)
        // add ball
        this.ball = this.physics.add.sprite(width/2, height - height /10, "ball")
        this.ball.body.setCircle(this.ball.width/2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)
        // add walls

        let wallA = this.physics.add.sprite(0, height/4, "wall")
        wallA.setX(Phaser.Math.Between(0+wallA.width/2, width-wallA.width/2))
        wallA.setImmovable(true)

        this.wallB = this.physics.add.sprite(0, height/4, "wall")
        this.wallB.setX(Phaser.Math.Between(0+this.wallB.width/2, width-this.wallB.width/2))
        this.wallB.setImmovable(true)
        this.wallVelocityX = 100
        this.wallB.setVelocityX(this.wallVelocityX)

        this.walls = this.add.group([wallA, this.wallB])
        // add one-way

        this.oneWay = this.physics.add.sprite(width/2, height/4*3, "oneway")
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2,width - this.oneWay.width/2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // add pointer input
        this.input.on("pointerdown", (pointer) => {
            //body of callback function
            let shotDirectionX = pointer.x <= this.ball.x ? 1 : -1 
            let shotDirectionY = pointer.y <= this.ball.y ? 1 : -1 //1 or -1, shoot up or down

            this.ball.body.setVelocityX(Phaser.Math.Between(this.SHOT_VELOCITY_X_MIN, this.SHOT_VELOCITY_X_MAX)*shotDirectionX)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX)*shotDirectionY)
            this.shotCounter++
        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            ball.body.setVelocityX(0)
            ball.body.setVelocityY(0)
            ball.setPosition(width/2 , height - height /10)
            this.score++


        } )

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)

    }

    update() {

        if (this.wallB.x >= width - this.wallB.width/2){
            this.wallB.setVelocityX(-100)
        }

        if (this.wallB.x <= this.wallB.width/2){
            this.wallB.setVelocityX(100)
        }

        this.scoreText.setText(`Score: ${this.score}`, this.ui_config)
        this.shotCounterText.setText(`Shots: ${this.shotCounter}`, this.ui_config)
        this.shotPerc = (this.score / this.shotCounter * 100).toFixed(2); // Calculate percentage and round to 2 decimal places
        this.shotPercText.setText(`Shot Percent: ${this.shotPerc}%`, this.ui_config)

    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[X] Add ball reset logic on successful shot
[X] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[X] Make one obstacle move left/right and bounce against screen edges
[X] Create and display shot counter, score, and successful shot percentage
*/