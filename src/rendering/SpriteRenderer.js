import { COLORS } from '../config/constants.js';

export class SpriteRenderer {
    constructor() {
        this.pixelSize = 2;
        this.sprites = this.defineSprites();
    }

    defineSprites() {
        return {
            fish1: [
                [
                    '  ....  ',
                    ' .RRRR. ',
                    '.RRRRRR.',
                    '.RWRRRR>',
                    '.RRRRRR>',
                    ' .RRRR. ',
                    '  ....  '
                ],
                [
                    '  ....  ',
                    ' .RRRR. ',
                    '.RRRRRR>',
                    '.RWRRRR.',
                    '.RRRRRR>',
                    ' .RRRR. ',
                    '  ....  '
                ],
                [
                    '  ....  ',
                    ' .RRRR.>',
                    '.RRRRRR.',
                    '.RWRRRR>',
                    '.RRRRRR.',
                    ' .RRRR.>',
                    '  ....  '
                ]
            ],
            fish2: [
                [
                    '   ...   ',
                    '  .YYY.  ',
                    ' .YYYYY. ',
                    '.YWYYYYY>',
                    ' .YYYYY. ',
                    '  .YYY.  ',
                    '   ...   '
                ],
                [
                    '   ...   ',
                    '  .YYY.  ',
                    ' .YYYYY.>',
                    '.YWYYYYY.',
                    ' .YYYYY.>',
                    '  .YYY.  ',
                    '   ...   '
                ],
                [
                    '   ...   ',
                    '  .YYY.  ',
                    ' .YYYYY. ',
                    '.YWYYYYY>',
                    ' .YYYYY. ',
                    '  .YYY.  ',
                    '   ...   '
                ]
            ],
            fish3: [
                [
                    '  .....  ',
                    ' .PPPPP. ',
                    '.PPPPPPP.',
                    '.PWPPPPPP>',
                    '.PPPPPPP>',
                    ' .PPPPP. ',
                    '  .....  '
                ],
                [
                    '  .....  ',
                    ' .PPPPP. ',
                    '.PPPPPPP>',
                    '.PWPPPPPP.',
                    '.PPPPPPP>',
                    ' .PPPPP. ',
                    '  .....  '
                ],
                [
                    '  .....  ',
                    ' .PPPPP.>',
                    '.PPPPPPP.',
                    '.PWPPPPPP>',
                    '.PPPPPPP.',
                    ' .PPPPP.>',
                    '  .....  '
                ]
            ],
            treasure: [
                '  .....  ',
                ' .YYYYY. ',
                '.Y.Y.Y.Y.',
                '.YYYYYYY.',
                '.Y.YYY.Y.',
                '.YYYYYYY.',
                ' ....... '
            ],
            boat: [
                '           ',
                '   llll    ',
                '  lHHHHl   ',
                ' .sDDDDDs. ',
                ' dDDDDDDd ',
                '  ..ddd..  '
            ],
            fisher: [
                '  pppp  ',
                '  LLLL  ',
                '  HHHH  ',
                '  sSSs  ',
                ' dSSSsd ',
                '  ddd   ',
                '  l l   ',
                '  l l   '
            ],
            hook: [
                ' s ',
                ' s ',
                ' s ',
                ' L '
            ],
            bubble: [
                ' . ',
                '.W.',
                ' . '
            ],
            seaweed: [
                [
                    '  .G.  ',
                    '  .G.  ',
                    ' .GGG. ',
                    '  .G.  ',
                    ' .GGG. ',
                    '  .G.  ',
                    '.GGGGG.',
                    '  .G.  '
                ],
                [
                    '  .G.  ',
                    ' .GG.  ',
                    '  .G.  ',
                    ' .GGG. ',
                    '  .G.  ',
                    ' .GGG. ',
                    '.GGGGG.',
                    '  .G.  '
                ],
                [
                    '  .G.  ',
                    '  .GG. ',
                    '  .G.  ',
                    ' .GGG. ',
                    '  .G.  ',
                    ' .GGG. ',
                    '.GGGGG.',
                    '  .G.  '
                ]
            ],
            cloud: [
                '  .....  ',
                ' ....... ',
                '.........'
            ]
        };
    }

    drawSprite(ctx, sprite, x, y, flip = false, scale = 1) {
        const pixels = Array.isArray(sprite[0]) ? sprite[0] : sprite;

        ctx.save();
        if (flip) {
            ctx.translate(x + pixels[0].length * this.pixelSize * scale, y);
            ctx.scale(-1, 1);
            x = 0;
            y = 0;
        }

        pixels.forEach((row, py) => {
            for (let px = 0; px < row.length; px++) {
                const pixel = row[px];
                if (pixel !== ' ' && pixel !== '.') {
                    ctx.fillStyle = this.getColor(pixel);
                    ctx.fillRect(
                        x + px * this.pixelSize * scale,
                        y + py * this.pixelSize * scale,
                        this.pixelSize * scale,
                        this.pixelSize * scale
                    );
                }
            }
        });

        ctx.restore();
    }

    getColor(code) {
        const colorMap = {
            'W': COLORS.WHITE,
            'B': COLORS.BLACK,
            'R': COLORS.RED,
            'Y': COLORS.YELLOW,
            'G': COLORS.GREEN,
            'b': COLORS.BLUE,
            'P': COLORS.PURPLE,
            'O': COLORS.ORANGE,
            'D': '#322c5b',
            'd': '#211c3d',
            's': '#5f73c8',
            'S': '#41559a',
            'l': '#91a0ff',
            'L': '#f3f0ff',
            'H': '#ffd9bd',
            'p': '#ff88bc',
            '>': '#ff7599',
            '.': 'rgba(20, 18, 44, 0.35)'
        };
        return colorMap[code] || COLORS.BLACK;
    }
}
