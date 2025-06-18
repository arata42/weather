const apiKey = '5eda8375041388dd445559a796cf189e';
const lat = 35.6595;
const lon = 139.7005;
const updateInterval = 5 * 60 * 1000; // 5分

async function fetchWeather() {
	try {
		const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`);
		//https://api.openweathermap.org/data/2.5/weather?lat=35.6595&lon=139.7005&appid=5eda8375041388dd445559a796cf189e&units=metric&lang=ja
		const data = await res.json();
		console.log(data);
		
		const sunrise_UNIX = data.sys.sunrise; // 例: 1747596819
		const sunset_UNIX = data.sys.sunset;
		
		const sunrise_jst = new Date(sunrise_UNIX * 1000); // ミリ秒に変換してDateに渡す
		const sunset_jst = new Date(sunset_UNIX * 1000); // ミリ秒に変換してDateに渡す
		
		const sunrise = sunrise_jst.toLocaleTimeString('ja-JP');
		const sunset = sunset_jst.toLocaleTimeString('ja-JP');
		console.log(new Date().toLocaleString('ja-JP'));
		console.log('日の出:', sunrise, 
			'\n日の入:', sunset);
		
		const weather = data.weather[0].main.toLowerCase(); // clear, rain, clouds...
		const description = data.weather[0].description;
		const icon = data.weather[0].icon;
		const temp = data.main.temp;
		const humidity = data.main.humidity;
		const pressure = data.main.pressure;
		
		updateDesign(sunrise_UNIX, sunset_UNIX, weather, temp);
		updatePressureStyle(pressure);
		
		document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
		document.getElementById('weather-info').textContent = `天気：${description}\n気温：${temp}℃ / 湿度：${humidity}%\n気圧：${pressure}hPa\n日の出：${sunrise} / 日の入：${sunset}`;//${temp.toFixed(1)}℃`;
	} catch (err) {
		console.error('天気取得エラー:', err);
		document.getElementById('weather-info').textContent = '天気情報の取得に失敗しました';
	}
}

function updateDesign(sunrise_UNIX, sunset_UNIX, weather, temp) {
	document.body.className = '';
	
	const now = Math.floor(Date.now() / 1000); // 現在のUNIX時間（秒）
	
	const isDaytime = now >= sunrise_UNIX && now < sunset_UNIX;
	
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
		showMessage('高気圧 - 安定した天気が続きそうです ☀️');
		document.getElementById('pressure-message').style.color = '#d0f0ff'; // 明るい青
		//document.body.style.backgroundColor = '#d0f0ff'; // 明るい青
		//document.body.style.color = '#000';
	} else if (pressure >= 1010) {
		showMessage('おおむね良い天気です 🌤');
		document.getElementById('pressure-message').style.color = '#e8faff'; // やや青
	} else if (pressure >= 1000) {
		showMessage('やや不安定な天気かも 🌥');
		document.getElementById('pressure-message').style.color = '#f0f0f0'; // 灰色
	} else if (pressure >= 990) {
		showMessage('低気圧が近づいています 🌧');
		document.getElementById('pressure-message').style.color = '#c0c0c0'; // 暗めの灰
	} else {
		showMessage('荒天の可能性があります ⚠️');
		document.getElementById('pressure-message').style.color = '#6e4c4c'; // 暗赤
		//document.body.style.color = '#fff';
	}
}

function showMessage(text) {
	const msg = document.getElementById('pressure-message');
	if (msg) {
		msg.textContent = text;
	} else {
		const p = document.createElement('p');
		p.id = 'pressure-message';
		p.textContent = text;
		document.getElementById('info_back').appendChild(p);
	}
}

fetchWeather();
setInterval(fetchWeather, updateInterval);