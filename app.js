const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const playlist = $(".playlist");
const getHeading = $('header h2');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const audio = $('#audio');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const PlAYER_STORAGE_KEY = 'F8';

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: {},
    saveConfigToLocalStorage: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {
        isRandom: false,
        isRepeat: false,
    },
    songs: [
        {
            name: "Waiting For You",
            singer: "MONO",
            path: "./assets/music/music_Waiting For You.mp3",
            image: "./assets/img/wtfuu.jpg"
        },
        {
            name: "We Don't Talk Anymore",
            singer: "Charlie Puth",
            path: "./assets/music/music_We Don_t Talk Anymore - Charlie Puth_ Se.mp3",
            image: "./assets/img/wedonttalkanymore.jpg"
        },
        {
            name: "Say Do You",
            singer: "Tiên Tiên",
            path: "./assets/music/music_Say-You-Do-Tien-Tien.mp3",
            image: "./assets/img/sayudo.jpg"
        },
        {
            name: "2AM - JustaTee ft. Big Daddy",
            singer: "JustaTee",
            path: "./assets/music/mp3_y2mate.com - 2AM  JustaTee  feat Big Daddy Official Audio.mp3",
            image: "./assets/img/2am.jpg"
        },
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path: "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
            image: "https://i.ytimg.com/vi/yBRKqRc-vyQ/maxresdefault.jpg",
            
        },
        {
            name: "Yêu Đương Khó Quá Chạy Về Khóc Với Anh",
            singer: "ERIK",
            path: "./assets/music/mp3_y2mate.com - ERIK  yêu đương khó quá thì CHẠY VỀ KHÓC VỚI ANH  Official Music Video Genshin Impact.mp3",
            image: "./assets/img/erik.jpg",
        },
        {
            name: "Yêu Ai Để Không Phải Khóc",
            singer: "Hương Ly",
            path: "./assets/music/mp3_y2mate.com - Yêu ai đê không phai khoc.mp3",
            image: "./assets/img/yadkpk.jpg"
        },
        {
            name: "Gió Vẫn Hát",
            singer: "Long Phạm",
            path: "./assets/music/mp3_y2mate.com - Gió Vẫn Hát  Long Phạm  Acoustic Top Hit.mp3",
            image: "./assets/img/giovanhat.jpg"
        },
        {
            name: "Reality",
            singer: "Raftaar",
            path: "./assets/music/Reality-Lost-Frequencies-Janieck-Devy.mp3",
            image: "./assets/img/reality.jpg"
        }
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
        playlist.innerHTML = htmls.join("");
    },
    // defineProperties: function() {
    //     Object.defineProperty(this, 'currentSong', {
    //         get: function() {
    //             return this.songs[this.currentIndex];
    //         }
    //     });
    // },
    handleEvent: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //Xử lý CD quay/ko quay
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,  //10 seconds
            iterations: Infinity
        });   
        cdThumbAnimate.pause();
        
        //Xử lý phóng to / Thu nhỏ CD
        document.onscroll = function() {
            const Scroll = window.scrollY || document.documentElement.scrollTop;
            const newcdWidth = cdWidth - Scroll;
            cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0;
            cd.style.opacity = newcdWidth / cdWidth;
        }

        //Xử lý khi click play/pause
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }
        //Khi song được pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        }
        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        }
        // Input range chạy theo tiến độ bài hát
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercentage = (audio.currentTime / audio.duration) * 100;
                progress.value = progressPercentage;
            }
        }
        // Xử lý tua bài hát
        progress.onchange = function(e) {
            const tasselPosition = (audio.duration * e.target.value) / 100;
            audio.currentTime = tasselPosition;
        }
        // Xử lý khi click vào next bài hát
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // Xử lý khi click vào prev bài hát
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // Xử lý khi click vào nút random bài hát
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.saveConfigToLocalStorage('isRandom', _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
        }
        // Xử lý khi click vào nút repeat bài hát
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.saveConfigToLocalStorage('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        }
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            }
            else if(_this.isRandom) {
                _this.playRandomSong();
                _this.render();
                _this.scrollToActiveSong();
                audio.play();
            }
            else {
                nextBtn.click();
            }
        }
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.getAttribute('data-index'));
                    _this.loadCurrentSongToDashboard();
                    _this.scrollToActiveSong();
                    _this.render();
                    audio.play();
                }
                if(e.target.closest('.option')) {
                    //.................
                }
            }
        }
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    loadCurrentSongToDashboard: function() {
        getHeading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    loadConfigToInterface: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0;
        }
        this.loadCurrentSongToDashboard();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSongToDashboard();
    },
    playRandomSong: function() {
        do {
            var newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSongToDashboard();
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }, 300);        
    },
    start: function() {
        //Render playlist
        this.render();
        
        //Lắng nghe / Xử lý các sự kiện
        this.handleEvent();
        
        //Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        //Tải thông tin bài hát đầu tiền vào UI khi chạy ứng dụng
        this.loadCurrentSongToDashboard();

        //Gán cấu hình từ config vào ứng dụng và hiển thị 
        //trạng thái cấu hình ra giao diện
        this.loadConfigToInterface();

        // Hiển thị trạng thái của button repeat & random khi ON ứng dụng
        // randomBtn.classList.toggle("active", this.isRandom);
        // repeatBtn.classList.toggle("active", this.isRepeat);
    }
}
app.start();