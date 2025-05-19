const apiKey = '5eda8375041388dd445559a796cf189e';
const lat = 35.6595;
const lon = 139.7005;
const updateInterval = 5 * 60 * 1000; // 5分

async function fetchWeather() {
	try {
		const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`);
		const data = await res.json();
		console.log(data);
		
		const sunrise = data.sys.sunrise; // 例: 1747596819
		const sunset = data.sys.sunset;
		
		const sunriseTime = new Date(sunrise * 1000); // ミリ秒に変換してDateに渡す
		const sunsetTime = new Date(sunset * 1000); // ミリ秒に変換してDateに渡す
		console.log('日の出:', sunriseTime.toLocaleTimeString('ja-JP'), 
			'\n日没:', sunsetTime.toLocaleTimeString('ja-JP'));
		
		const weather = data.weather[0].main.toLowerCase(); // clear, rain, clouds...
		const description = data.weather[0].description;
		const icon = data.weather[0].icon;
		const temp = data.main.temp;
		const humidity = data.main.humidity;
		const pressure = data.main.pressure;
		
		updateDesign(sunrise, sunset, weather, temp);
		updatePressureStyle(pressure);
		
		document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
		document.getElementById('weather-info').textContent = `天気：${description}\n気温：${temp}℃ / 湿度：${humidity}%\n気圧：${pressure}hPa`;//${temp.toFixed(1)}℃`;
	} catch (err) {
		console.error('天気取得エラー:', err);
		document.getElementById('weather-info').textContent = '天気情報の取得に失敗しました';
	}
}

function updateDesign(sunrise, sunset, weather, temp) {
	document.body.className = '';
	
	const now = Math.floor(Date.now() / 1000); // 現在のUNIX時間（秒）
	
	const isDaytime = now >= sunrise && now < sunset;

	// まずday/nightクラスを切り替え
	document.body.classList.toggle('day', isDaytime);
	document.body.classList.toggle('night', !isDaytime);
	
	if (weather.includes('clear')) {
		document.body.classList.add('sunny');
	} else if (weather.includes('rain')) {
		document.body.classList.add('rainy');
	} else if (weather.includes('cloud')) {
		document.body.classList.add('cloudy');
	}
	
	if (temp >= 30) {
		document.body.classList.add('hot');
	} else if (temp <= 5) {
		document.body.classList.add('cold');
	}
}

function updatePressureStyle(pressure) {
	if (pressure >= 1020) {
		document.body.style.backgroundColor = '#d0f0ff'; // 明るい青
		//document.body.style.color = '#000';
		showMessage('高気圧 - 安定した天気が続きそうです ☀️');
	} else if (pressure >= 1010) {
		document.body.style.backgroundColor = '#e8faff'; // やや青
		showMessage('おおむね良い天気です 🌤');
	} else if (pressure >= 1000) {
		document.body.style.backgroundColor = '#f0f0f0'; // 灰色
		showMessage('やや不安定な天気かも 🌥');
	} else if (pressure >= 990) {
		document.body.style.backgroundColor = '#c0c0c0'; // 暗めの灰
		showMessage('低気圧が近づいています 🌧');
	} else {
		document.body.style.backgroundColor = '#6e4c4c'; // 暗赤
		//document.body.style.color = '#fff';
		showMessage('荒天の可能性があります ⚠️');
	}
}

function showMessage(text) {
	const msgElem = document.getElementById('pressure-message');
	if (msgElem) {
		msgElem.textContent = text;
	} else {
		const p = document.createElement('p');
		p.id = 'pressure-message';
		p.textContent = text;
		document.body.appendChild(p);
	}
}


fetchWeather();
setInterval(fetchWeather, updateInterval);
