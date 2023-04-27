

export class Tree {
    constructor(x, y, type, img, shadow) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.img = img;
        this.shadow = shadow;
    }

    draw_shadow(ctx) {
        ctx.drawImage(this.shadow, this.x, this.y, 200, 200);
    }

    draw_tree(ctx) {
        ctx.drawImage(this.img, this.x, this.y, 200, 200);
    }

    static createTrees(posArray, images, shadows) {
        let trees = [];
        posArray.forEach(function(pos) {
            let type = Math.floor(Math.random() * 3);
            let img = images[type];
            let shadow = shadows[type];
            let offsetX = 0;
            let offsetY = 0;
            if (type === 0) {
                offsetX = - 52;
                offsetY = - 174;
            } else if (type === 1) {
                offsetX = - 100;
                offsetY = - 165;
            } else if (type === 2) {
                offsetX = -100;
                offsetY = - 185;
            }
            trees.push(new Tree(pos[0] + offsetX, pos[1] + offsetY, type, img, shadow));
        });
        return trees;
    }

  };