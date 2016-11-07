/*global Phaser*/


var game = new Phaser.Game(800, 600, Phaser.AUTO, '');
var game_state = {}


game_state.main = function() {};
game_state.main.prototype = {


    preload: function() {
        game.load.image('star', 'assets/star.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('sky', 'assets/sky.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
        game.load.image('diamond', 'assets/diamond.png');
    },


    create: function() {
        game.add.sprite(0, 0, 'star')
        game.add.sprite(0, 0, 'diamond')
        game.add.sprite(0, 0, 'sky');


        this.platforms = game.add.group();
        this.platforms.enableBody = true;

        var ground = this.platforms.create(0, game.world.height - 64, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        var ledge = this.platforms.create(400, 200, 'ground');
        ledge.body.immovable = true;
        var ledge = this.platforms.create(200, 325, 'ground');
        ledge.body.immovable = true;
        var ledge = this.platforms.create(0, 450, 'ground');
        ledge.body.immovable = true;

        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.player = game.add.sprite(32, game.world.height - 150, 'dude')
        game.physics.arcade.enable(this.player);
        this.player2 = game.add.sprite(32, game.world.height - 150, 'baddie')
        this.physics.arcade.enable(this.player2);
        this.player.body.bounce.y = 1;
        this.player.body.gravity.y = 90;
        this.player.body.collideWorldBounds = true;
        this.player2.body.bounce.y = 1;
        this.player2.body.gravity.y = 90;
        this.player2.body.collideWorldBounds = true;

        this.stars = game.add.group();
        this.stars.enableBody = true;
        for (var i = 0; i < 60; i++) {
            var star = this.stars.create(i * 70, 0, 'star');
            star.body.gravity.y = 300;
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        this.diamonds = game.add.group();
        this.diamonds.enableBody = true;
        for (var i = 0; i < 60; i++) {
            var diamond = this.diamonds.create(i * 70, 0, 'diamond');
            diamond.body.gravity.y = 300;
            diamond.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        // Adds WASD keys.  example: for pressing w(up), you would do this.wasd.up.isDown
        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        };



        this.scoreText = game.add.text(16, 16, 'score: 0', {
            fontSize: '32px',
            fill: '#000'
        });
        this.score = 0

        this.cursors = game.input.keyboard.createCursorKeys();

        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.player2.animations.add('left', [0, 1], 10, true);
        this.player2.animations.add('right', [2, 3], 10, true);

    },


    update: function() {

        game.physics.arcade.collide(this.player, this.platforms);
        this.cursors = game.input.keyboard.createCursorKeys();
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -150;
            this.player.animations.play('left');
        }

        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 150;
            this.player.animations.play('right');
        }

        else {
            this.player.animations.stop();
            this.player.frame = 4;
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.velocity.y = -350;
        }
        game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);


        game.physics.arcade.collide(this.player2, this.platforms);
        this.player2.body.velocity.x = 0;

        if (this.wasd.left.isDown) {
            this.player2.body.velocity.x = -150;
            this.player2.animations.play('left');
        }

        else if (this.wasd.right.isDown) {
            this.player2.body.velocity.x = 150;
            this.player2.animations.play('right');
        }

        else {
            this.player2.animations.stop();
            this.player2.frame = 4;
        }

        if (this.wasd.up.isDown && this.player2.body.touching.down) {
            this.player2.body.velocity.y = -350;
        }

        game.physics.arcade.overlap(this.player2, this.diamonds, this.collectDiamond, null, this);

        game.physics.arcade.collide(this.stars, this.platforms);
        game.physics.arcade.collide(this.diamonds, this.platforms);




    },

    collectStar: function(player, star) {
        this.score += 1;
        this.scoreText.text = "Score:" + this.score;
        star.kill();
    },
    
    collectDiamond: function(player2, diamond) {
        this.score += 1;
        this.scoreText.text = "Score:" + this.score;
        diamond.kill();
    },



}
game.state.add('main', game_state.main);

