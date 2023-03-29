const LOAD_TIME = 1400;
const FONT_SIZE = 36;

function load(spinner_interval_id) {
    document.body.classList.remove('loading');
    window.clearInterval(spinner_interval_id);
}

function main() {
    
    var spinner_frame = 0;
    var $spinner = document.getElementById('loading');
    var $subtitle = document.getElementById('subtitle');
    var $title = document.getElementById('title');
    var $social_name = document.getElementById('social_name');

    function setMenu(name, title) {
        document.querySelectorAll('.menu').forEach(el => {
            el.classList.add('hide');
        });
        document.getElementById(name + '_menu').classList.remove('hide');
        if (title) {
            $title.style.backgroundPositionY = `-${title * 88}px`;
        }
        else {
            $title.style.backgroundPositionY = '0px';
        }
    }

    setMenu('main');

    function spinner() {
        spinner_frame += 1;
        if (spinner_frame > 15)
            spinner_frame = 0;
        $spinner.style.backgroundPositionX = -(spinner_frame * 128) + 'px';
    }

    var spinner_interval_id = window.setInterval(spinner, 20);

    window.setTimeout(load, LOAD_TIME, spinner_interval_id);

    document.querySelectorAll('.panel').forEach(el => {
        el.style.backgroundImage = `url(${el.getAttribute('background-image')})`;
        el.addEventListener('mouseenter', ev => {
            let i = el.getAttribute('subtitle');
            $subtitle.style.backgroundPositionY = `-${12 * i}px`;
        });
        el.addEventListener('mouseleave', ev => {
            $subtitle.style.backgroundPositionY = `0px`;
        });
    });

    document.querySelectorAll('#social_menu a.sprite').forEach(el => {
        el.addEventListener('mouseenter', ev => {
            let i = el.getAttribute('nameidx');
            $social_name.style.backgroundPositionY = `-${14 * i}px`;
        });
        el.addEventListener('mouseleave', ev => {
            $social_name.style.backgroundPositionY = `0px`;
        });
    });

    var $shard = document.getElementById('shard');
    var $bg_shard = document.getElementById('background_shard');
    var shard_flipped = false;
    var shard_interval_id = null;
    var shard_frame = 0;
    var bg_shard_frame = 0;
    var bg_shard_interval_id = null;

    function bgShardFlipAnimation() {
        if (shard_flipped) {
            bg_shard_frame -= 1;
            if (bg_shard_frame < 1) {
                bg_shard_frame = 0;
                window.clearInterval(bg_shard_interval_id);
            }
        }
        else {
            bg_shard_frame += 1;
            if (bg_shard_frame > 3) {
                bg_shard_frame = 4;
                window.clearInterval(bg_shard_interval_id);
            }
        }
        $bg_shard.style.backgroundPositionX = -(bg_shard_frame * (334 * 2)) + 'px';
    }

    function shardFlipAnimation(callback) {
        shard_frame += 1;
        if (shard_frame > 3) {
            window.clearInterval(shard_interval_id);
            shard_frame = 4;
            callback();
        }
        $shard.setAttribute('frame', shard_frame);
        $shard.style.backgroundPositionX = -(shard_frame * (179 * 2)) + 'px';
    }

    function shardUnflipAnimation(callback) {
        shard_frame -= 1;
        if (shard_frame == 0) {
            window.clearInterval(shard_interval_id);
            callback();
        }
        $shard.setAttribute('frame', shard_frame);
        $shard.style.backgroundPositionX = -(shard_frame * (179 * 2)) + 'px';
    }

    function playShardAnimation(animation, speed, callback) {
        shard_interval_id = window.setInterval(animation, speed, callback);
    }

    function flipShard(callback, midpoint_callback) {
        const shard_animation_speed = 24;
        $shard.classList.add('hide_panels');
        if (shard_flipped) {
            bg_shard_interval_id = window.setInterval(bgShardFlipAnimation, 28);
            playShardAnimation(shardFlipAnimation, shard_animation_speed, () => {
                $shard.classList.remove('flipped');
                $title.classList.remove('flipped');
                $subtitle.classList.remove('flipped');
                if (midpoint_callback) midpoint_callback();
                playShardAnimation(shardUnflipAnimation, shard_animation_speed, () => {
                    shard_flipped = false;
                    $shard.classList.remove('hide_panels');
                    if (callback) callback();
                })
            });
        }
        else {
            bg_shard_interval_id = window.setInterval(bgShardFlipAnimation, 28);
            playShardAnimation(shardFlipAnimation, shard_animation_speed, () => {
                $shard.classList.add('flipped');
                $title.classList.add('flipped');
                $subtitle.classList.add('flipped');
                if (midpoint_callback) midpoint_callback();
                playShardAnimation(shardUnflipAnimation, shard_animation_speed, () => {
                    shard_flipped = true;
                    $shard.classList.remove('hide_panels');
                    if (callback) callback();
                })
            });
        }
    }

    document.querySelectorAll('#social_menu a.sprite').forEach(el => {
        el.style.backgroundPositionY = `-${parseInt(el.getAttribute('index')) * (27 * 2)}px`;
    });

    document.getElementById('social_panel').onclick = function () {
        $title.classList.add('hide');
        $subtitle.classList.add('hide');
        $shard.classList.add('hide');
        $bg_shard.classList.add('hide');
        setMenu('social', 0);
    };

    document.getElementById('games_panel').onclick = function () {
        flipShard(null, () => {
            setMenu('game', 1);
        });
    };

    document.getElementById('media_panel').onclick = function () {
        flipShard(null, () => {
            setMenu('media', 2);
        });
    };

    document.getElementById('game_main_menu_return').onclick = function () {
        flipShard(null, () => {
            setMenu('main', 0);
        });
    }

    document.getElementById('media_main_menu_return').onclick = function () {
        flipShard(null, () => {
            setMenu('main', 0);
        });
    }

    document.getElementById('social_main_menu_return').onclick = function () {
        $title.classList.remove('hide');
        $subtitle.classList.remove('hide');
        $shard.classList.remove('hide');
        $bg_shard.classList.remove('hide');
        setMenu('main', 0);
    }

    // document.querySelectorAll('.text').forEach(el => {
    //     el.style.fontSize = (FONT_SIZE * 2) + 'px';
    //     el.style.color = 'rgba(0, 0, 0, 0)';
    //     el.style.display = 'flex';
    //     let text = el.getAttribute('text');
    //     let color = el.getAttribute('color');
    //     let background = null;
    //     let mask = false;
    //     if (color == 'black')
    //         background = '/sprites/font_b.png';
    //     else if (color == 'white')
    //         background = '/sprites/font_w.png';
    //     else {
    //         mask = true;
    //         background = '/sprites/font_b.png';
    //     }
    //     for (let i = 0; i < text.length; i++) {
    //         let char_el = document.createElement('div');
    //         char_el.classList.add('character');
    //         char_el.innerHTML = text[i];
    //         char_el.style.width = 34 + 'px';
    //         char_el.style.height = (FONT_SIZE * 2) + 'px';
    //         if (mask) {
    //             char_el.style.maskImage = `url("${background}")`;
    //             char_el.style.backgroundColor = color;
    //             char_el.style.maskMode = 'alpha';
    //             char_el.style.maskPosition = `-${(text.charCodeAt(i) - 32)}px 0px`;
    //         }
    //         else {
    //             char_el.style.backgroundImage = `url("${background}")`;
    //             char_el.style.backgroundPosition = `-${text.charCodeAt(i) - 32}px 0px`;
    //         }
    //         el.appendChild(char_el);
    //     }
    // });
}