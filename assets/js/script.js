const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const volumeBtn = $('#volume');
const randomBtn = $('.btn-random')
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const PlAYER_STORAGE_KEY = "MEGA_PLAYER";

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isSeeking: false, // biến cờ kiểm tra người dùng có đang kéo thanh tua không
    playedIndexes: [],
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Color",
            singer: "FLOW",
            path: "assets/music/color.mp3",
            image: "assets/img/color.jpg"
        },

        {
            name: "Wine of Mellow Shade",
            singer: "Jacky Cheung",
            path: "assets/music/country.mp3",
            image: "assets/img/country.jpg"
        },

        {
            name: "Il Canto Degli Italiani",
            singer: "Annalisa",
            path: "assets/music/italiani.mp3",
            image: "assets/img/italiani.jpg"
        },

        {
            name: "Hazy Moon",
            singer: "Grace Wong",
            path: "assets/music/hazy moon.mp3",
            image: "assets/img/hazy moon.jpg"
        },

        {
            name: "Shinkenger",
            singer: "Psychic Lover",
            path: "assets/music/shinkenger.mp3",
            image: "assets/img/shinkenger.jpg"
        },
        {
            name: "Un Monde Sans Danger",
            singer: "Julien Lamassonne",
            path: "assets/music/lyoko.mp3",
            image: "assets/img/lyoko.jpg"
        },
        {
            name: "Adventure",
            singer: "GARDEN",
            path: "assets/music/pokemon.mp3",
            image: "assets/img/pokemon.jpg"
        },

        {
            name: "Kizudarake no Ai",
            singer: "WEST",
            path: "assets/music/tsubasa.mp3",
            image: "assets/img/tsubasa.jpg"
        },

        {
            name: "Tuxedo Mirage",
            singer: "Michelle Hui",
            path: "assets/music/sailor moon.mp3",
            image: "assets/img/sailor moon.jpg"
        },

        {
            name: "ROCK",
            singer: "Hound Dog",
            path: "assets/music/naruto.mp3",
            image: "assets/img/naruto.jpg"
        },
        {
            name: "Fantasy Tales",
            singer: "Stephy Tang",
            path: "assets/music/fantasy.mp3",
            image: "assets/img/fantasy.jpg"
        },
        {
            name: "Captured Magical Moment",
            singer: "ZARDS",
            path: "assets/music/slam dunk.mp3",
            image: "assets/img/slam dunk.jpg"
        },
        {
            name: "Lucky",
            singer: "Myolie Wu",
            path: "assets/music/ngay buon nhat.mp3",
            image: "assets/img/ngay buon nhat.jpg"
        },
        {
            name: "The Harder We Love",
            singer: "Jinny Ng",
            path: "assets/music/cang kho cang yeu.mp3",
            image: "assets/img/cang kho cang yeu.jpg"
        },
    ],

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active':''}" data-index="${index}">
                        <div class="thumb"
                            style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                </div>
                    
            `
        })
        playlist.innerHTML =htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    hanldeEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: "rotate(360deg)" }
        ],{
        duration: 10000, // 10 seconds
        iterations: Infinity
        });
        cdThumbAnimate.pause();

        // xử lý phóng to thu nhỏ đĩa nhạc quay
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdwidth = cdWidth - scrollTop

            cd.style.width = newCdwidth > 0 ? newCdwidth + "px" : 0
            cd.style.opacity = newCdwidth /cdWidth
        }

        // xử lý khi bấm play
        playBtn.onclick = function (){

            if(_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
            
        }

        // Khi bài hát được play 
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add("playing")
            cdThumbAnimate.play();
        }
        // Khi bài hát bị pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove("playing")
            cdThumbAnimate.pause();
        }

        
         function updateProgressColor(percent) {
            // Đổi màu nền thanh trượt bằng linear-gradient
            // Từ 0% -> percent: Màu xanh
            // Từ percent -> 100%: Màu xám 
            const numericPercent = Number(percent); // Ép về kiểu Số
            progress.style.background = `linear-gradient(to right, #00ff88 0%, #00ff88 ${percent}%, #ccc ${percent}%, #ccc 100%)`;
        }
        
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent

                // GỌI HÀM TÔ MÀU: Cập nhật vệt màu xanh ngay lập tức theo tay kéo
                updateProgressColor(progressPercent);
            }
        }

        //  sửa lỗi tua: Xử lý khi nhấn và kéo
        progress.onmousedown = function () {
            _this.isSeeking = true;
        };

        progress.ontouchstart = function () {
            _this.isSeeking = true;
        };

        // Xử lý khi tua bằng cách kéo tay trên thanh tiến trình 
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime

            // Lấy e.target.value truyền trực tiếp vào hàm
            updateProgressColor(e.target.value);

        }

        // Xử lý điều chỉnh âm lượng
        // thuộc tính audio.volume chỉ nhận giá trị trong khoảng từ 
        // 0.0 (tắt tiếng hoàn toàn) đến 1.0 (âm lượng tối đa 100%).
        if (volumeBtn) {
            volumeBtn.oninput = function (e) {
                // 1. Khai báo biến rõ ràng (đã ép về kiểu số từ 0 - 100)
                const currentVolume = Number(e.target.value);

                // 2. Chia cho 100 để gán vào thuộc tính volume của thẻ <audio> (từ 0.0 đến 1.0)
                audio.volume = currentVolume / 100;

                // 3. Cập nhật giao diện (vệt màu xanh & icon loa)
                _this.updateVolumeColor(currentVolume);
                _this.updateVolumeIcon(currentVolume);

                // 4. Lưu lại mức volume (0 - 100) vào localStorage
                _this.setConfig("volume", currentVolume);
            };
        }

        // Khi bấm nút next để qua bài tiếp theo
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            } else{
                _this.nextSong()
            }
            audio.play()
             _this.render()
             _this.scrollToActiveSong()
             _this.setConfig("currentIndex", _this.currentIndex);
        }
        // Khi bấm nút prev để quay lại bài trước
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            } else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
            _this.setConfig("currentIndex", _this.currentIndex);
        }

        // Khi bật tắt nút random để chọn ngẫu nhiên bài hát
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle("active", _this.isRandom);
            _this.setConfig("isRandom", _this.isRandom);
        }

        // nút xử lý khi phát lại bài nhạc 
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active", _this.isRepeat);
            _this.setConfig("isRepeat", _this.isRepeat);
        }

        // Khi bài hát kết thúc và tự hát lại
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Khi bấm vào bài nào thì bài đó đổi màu và phát nhạc 
        playlist.onclick = function(e){
            const songNode = e.target.closest(".song:not(.active)")
            const optionNode = e.target.closest(".option")

            if(songNode || optionNode) {

                // Xử lý khi bấm vào bài đó trên lưới nhạc 
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                    _this.setConfig("currentIndex", _this.currentIndex);
                    _this.scrollToActiveSong()
                }
                // Xử lý khi bấm vào dấu tuỳ chọn trên bài hát
                if(optionNode){

                }
            }
        }
    },

    //  Hàm tô màu vệt cho thanh âm lượng
    updateVolumeColor: function (percent) {
        if (volumeBtn) {
            volumeBtn.style.background = `linear-gradient(to right, #00ff88 0%, #00ff88 ${percent}%, #ccc ${percent}%, #ccc 100%)`;
        }
    },

    // Hàm đổi biểu tượng thanh âm lượng 
    updateVolumeIcon: function (value) {
        const volumeIcon = $(".volume-icon");
        if (!volumeIcon) return;

        const val = Number(value);

        if (val === 0) {
            volumeIcon.className = "fa-solid fa-volume-xmark volume-icon";
        } else if (val <= 50) {
            volumeIcon.className = "fa-solid fa-volume-low volume-icon";
        } else {
            volumeIcon.className = "fa-solid fa-volume-high volume-icon";
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            // Nếu là bài đầu tiên (hoặc bài số 0), cho màn hình cuộn mượt lên hẳn đỉnh (để hiện đĩa CD)
            if (this.currentIndex < 3) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                // Các bài còn lại thì chỉ scroll cái ô bài hát vào tầm mắt
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            }
        }, 200);
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom || false;
        this.isRepeat = this.config.isRepeat || false;
        this.currentIndex = this.config.currentIndex || 0;

        // Khôi phục nút bấm UI
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);

        // Khôi phục Âm lượng (mặc định 100%)
        const savedVolume = this.config.volume !== undefined ? this.config.volume : 100;
        audio.volume = savedVolume / 100;
        if (volumeBtn) {
            volumeBtn.value = savedVolume;
            this.updateVolumeColor(savedVolume); // Cập nhật màu theo giá trị đã lưu
            this.updateVolumeIcon(savedVolume);
        }

        
        
    },

    nextSong: function () {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong() 
    },
    prevSong: function () {
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong() 
    },

    playRandomSong: function () {
        // Lưu bài hiện tại vào danh sách đã phát (nếu chưa có)
        if (!this.playedIndexes.includes(this.currentIndex)) {
            this.playedIndexes.push(this.currentIndex);
        }

        // Nếu đã phát hết tất cả các bài, làm mới lại danh sách (chỉ giữ bài đang phát)
        if (this.playedIndexes.length >= this.songs.length) {
            this.playedIndexes = [this.currentIndex];
        }

        // Tìm bài ngẫu nhiên chưa có trong mảng playedIndexes
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (this.playedIndexes.includes(newIndex));

        // Cập nhật chỉ số bài mới và lưu lại
        this.currentIndex = newIndex;
        this.playedIndexes.push(newIndex);
        this.setConfig("currentIndex", this.currentIndex);
        this.loadCurrentSong();
    },

    start: function (){
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa thuộc tính cho Object
        this.defineProperties();

        // lắng nghe xử lý các sự kiện DOM
        this.hanldeEvents();

        // tải thông tin bài đầu tiên vô UI
        this.loadCurrentSong()

        // truy vấn lại danh sách nhạc playlist
        this.render()
    }
} 
app.start();