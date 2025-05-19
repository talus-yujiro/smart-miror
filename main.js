// Supabaseクライアントの初期化
const supabaseUrl = "https://ksvdggybgpwfivohbxgn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzdmRnZ3liZ3B3Zml2b2hieGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NTUwMjYsImV4cCI6MjA1NjUzMTAyNn0.Q69y-106Q-bNmigGR4D431KSjBShR8Rw5_DMAQaKN3U";
const db = supabase.createClient(supabaseUrl, supabaseAnonKey);

// 日付の更新処理
async function updateDate() {
    const daysOfWeek = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
    while (true) {
        const now = new Date();
        const years = now.getFullYear().toString();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const date = now.getDate().toString().padStart(2, '0');
        const day = daysOfWeek[now.getDay()];
        document.getElementById("date").innerHTML = `${years}-${month}-${date} (${day})`;
        await new Promise(resolve => setTimeout(resolve, 600000))
    }
}

// 時刻の更新処理
async function updateClock() {
    while (true) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// 天気情報の更新処理
async function updateWeather() {
    const apiKey = 'bd9cd74922b86b8af7340f8b53d84750';
    const city = 'Mito';
    while (true) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ja`);
        const data = await response.json();

        const temperature = data.main.temp.toFixed(1);
        const weatherDescription = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const humidity = data.main.humidity;
        const feelsLike = data.main.feels_like.toFixed(1);
        const pressure = data.main.pressure;

        const weatherIcon = getWeatherIcon(iconCode);
        const weatherName = returnWeatherName(iconCode);

        const weatherElement = document.getElementById('weather');
        weatherElement.innerHTML = `<i class="weather-icon ${weatherIcon}"></i><small>${weatherName}</small><br>
                                        <p>${temperature}℃(${feelsLike}℃) / ${humidity}%  ${pressure}hpa</p>`;

        await new Promise(resolve => setTimeout(resolve, 600000));
    }
}

function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': 'fas fa-sun', '01n': 'fas fa-moon', '02d': 'fas fa-cloud', '02n': 'fas fa-cloud',
        '03d': 'fas fa-cloud-sun', '03n': 'fas fa-cloud-moon', '04d': 'fas fa-cloud', '04n': 'fas fa-cloud',
        '09d': 'fas fa-cloud-showers-heavy', '09n': 'fas fa-cloud-showers-heavy',
        '10d': 'fas fa-cloud-rain', '10n': 'fas fa-cloud-rain',
        '11d': 'fas fa-bolt', '11n': 'fas fa-bolt',
        '13d': 'fas fa-snowflake', '13n': 'fas fa-snowflake',
        '50d': 'fas fa-smog', '50n': 'fas fa-smog',
        '14d': 'fas fa-bolt', '14n': 'fas fa-bolt', '15d': 'fas fa-snowflake', '15n': 'fas fa-snowflake',
        '16d': 'fas fa-cloud-showers-heavy', '16n': 'fas fa-cloud-showers-heavy',
        '17d': 'fas fa-bolt', '17n': 'fas fa-bolt', '18d': 'fas fa-snowflake', '18n': 'fas fa-snowflake',
        '19d': 'fas fa-cloud-rain', '19n': 'fas fa-cloud-rain'
    };
    return iconMap[iconCode] || 'fas fa-question';
}

function returnWeatherName(iconCode) {
    const weatherMap = {
        '01d': '快晴', '01n': '快晴', '02d': '曇り', '02n': '曇り',
        '03d': '晴れ', '03n': '晴れ', '04d': '曇り', '04n': '曇り',
        '09d': '大雨', '09n': '大雨', '10d': '小雨', '10n': '小雨',
        '11d': '雷', '11n': '雷', '13d': '雪', '13n': '雪',
        '50d': '霧', '50n': '霧', '14d': '雷雨', '14n': '雷雨',
        '15d': '大雪', '15n': '大雪', '16d': '豪雨', '16n': '豪雨',
        '17d': '激しい雷雨', '17n': '激しい雷雨', '18d': '小雪', '18n': '小雪',
        '19d': '霧雨', '19n': '霧雨'
    };
    return weatherMap[iconCode] || '不明';
}

// ニュースデータを取得して表示
async function fetchNews() {
    const apiKey = '8cd6076653f299584af348b9d94e86df';
    const newsContainer = document.getElementById('news-list');
    newsContainer.innerHTML = '';
    const proxyUrl = 'https://corsproxy.io/?';
    const targetUrl = 'https://gnews.io/api/v4/top-headlines?lang=ja&country=jp&apikey=' + apiKey;

    fetch(proxyUrl + targetUrl)
        .then(res => res.json())
        .then(data => {
            const articles = data.articles;
            articles.forEach(article => {
                const artDiv = document.createElement('div');
                artDiv.innerHTML = `<strong>${article.title}</strong><p>${article.description}</p>`;
                newsContainer.appendChild(artDiv);
            });
        })
        .catch(err => console.log('Error:', err));

    await new Promise(resolve => setTimeout(resolve, 6000000));
}

async function scrollNews() {
    const newsList = document.getElementById("news-list");
    let scrollY = 0;
    await new Promise(resolve => setTimeout(resolve, 3000))
    while (true) {
        scrollY += 1;
        newsList.style.transform = `translateY(-${scrollY}px)`;
        if (scrollY >= newsList.scrollHeight - document.getElementById("news-container").clientHeight) {
            scrollY = 0;
            await new Promise(resolve => setTimeout(resolve, 3000))
        }
        await new Promise(resolve => setTimeout(resolve, 50))
    }
}

// ToDoリスト取得と描画
async function fetchTodos() {
    try {
        const { data, error } = await db.from("todos").select("*").order("completed", { ascending: true }).limit(7);
        if (error) return console.error("Error fetching todos:", error);
        renderTodos(data);
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

// ToDoリストをHTMLに反映
function renderTodos(todos) {
    const list = document.getElementById("todo");
    list.innerHTML = "";
    todos.forEach(todo => {
        const label = document.createElement("label");
        label.style.display = "block";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        if (todo.completed) {
            checkbox.checked = true;
            checkbox.disabled = true;
        } else {
            checkbox.addEventListener("change", async () => {
                if (checkbox.checked) {
                    checkbox.disabled = true;
                    await db.from("todos").update({ completed: true }).eq("id", todo.id);
                }
            });
        }

        label.appendChild(checkbox);
        label.append(` ${todo.title}`);
        list.appendChild(label);
    });
}

async function randomPicture() {
    while (true) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const response = await fetch(`https://picsum.photos/${width}/${height}`);
        if (response.ok) {
            const img = document.createElement("img");
            img.src = response.url;
            img.alt = "Random Picture";
            img.style.width = "auto";
            img.style.height = "100%";
            img.style.zIndex = "-1";
            img.style.position = "absolute";
            img.style.top = "0";
            img.style.left = "0";
            img.style.objectFit = "cover";
            document.body.appendChild(img);
        } else {
            console.error("Failed to fetch random picture");
        }
        await new Promise(resolve => setTimeout(resolve, 600000)); // 10分ごとに更新
    }
}

// 並行してすべての処理を開始
async function runTasks() {
    await Promise.all([updateDate(), updateClock(), updateWeather(), fetchNews(), scrollNews(), fetchTodos(), randomPicture()]);
}

document.addEventListener('DOMContentLoaded', runTasks);