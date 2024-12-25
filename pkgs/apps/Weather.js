// var esp = await fetch("https://wttr.in/alton?format=j1");

import Html from "../../libs/html.js";
import Ws from "/libs/windowSystem.js";
import Vfs from "../../libs/vfs.js";
import Sidebar from "../../components/Sidebar.js";
import icons from "../../components/icons.js";
import Modal from "../../libs/Modal.js";
import FileMappings from "../../libs/FileMappings.js";
import FileDialog from "../../libs/FileDialog.js";
import langManager from "../../libs/l10n/manager.js";
import { css } from "../../libs/templates.js";

let win;

const pkg = {
  name: langManager.getString("weather.name"),
  type: "app",
  privs: 0,
  style: css`
    .weather {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  `,

  start: async function (Root) {
    // Testing
    console.log("Hello from example app", Root);

    // Create a window
    win = new Ws.data.win({
      title: langManager.getString("weather.name"),
      width: 512,
      height: 348,
    });

    let index = {
      "Partly cloudy": icons.cloudSun,
      Sunny: icons.sun,
      Clear: icons.sun,
      Cloudy: icons.cloudy,
      Overcast: icons.cloudy,
      Mist: icons.cloudy,
      "Patchy rain possible": icons.cloudRain,
      "Patchy rain nearby": icons.cloudRain,
      "Patchy snow possible": icons.cloudSnow,
      "Patchy light snow": icons.cloudSnow,
      "Light snow": icons.cloudSnow,
      "Patchy moderate snow": icons.cloudSnow,
      "Moderate snow": icons.cloudSnow,
      "Patchy heavy snow": icons.cloudSnow,
      "Heavy snow": icons.cloudSnow,
      "Ice pellets": icons.cloudSnow,
      "Patchy light drizzle": icons.cloudRain,
      "Light drizzle": icons.cloudRain,
      "Freezing drizzle": icons.cloudRain,
      "Heavy freezing drizzle": icons.cloudRain,
      "Patchy light rain": icons.cloudRain,
      "Light rain": icons.cloudRain,
      "Moderate rain at times": icons.cloudRain,
      "Moderate rain": icons.cloudRain,
      "Heavy rain at times": icons.cloudRain,
      "Heavy rain": icons.cloudRain,
      "Light freezing rain": icons.cloudRain,
      "Moderate or heavy freezing rain": icons.cloudRain,
      "Light sleet": icons.cloudSnow,
      "Moderate or heavy sleet": icons.cloudSnow,
      "Patchy light snow": icons.cloudSnow,
      "Light snow": icons.cloudSnow,
      "Patchy moderate snow": icons.cloudSnow,
      "Moderate snow": icons.cloudSnow,
      "Patchy heavy snow": icons.cloudSnow,
      "Heavy snow": icons.cloudSnow,
      "Ice pellets": icons.cloudSnow,
      "Light rain shower": icons.cloudRain,
      "Moderate or heavy rain shower": icons.cloudRain,
      "Torrential rain shower": icons.cloudRain,
      "Light sleet showers": icons.cloudSnow,
      "Moderate or heavy sleet showers": icons.cloudSnow,
      "Light snow showers": icons.cloudSnow,
      "Moderate or heavy snow showers": icons.cloudSnow,
      "Light showers of ice pellets": icons.cloudSnow,
      "Moderate or heavy showers of ice pellets": icons.cloudSnow,
      "Patchy light rain with thunder": icons.cloudRain,
      "Moderate or heavy rain with thunder": icons.cloudRain,
      "Patchy light snow with thunder": icons.cloudSnow,
      "Moderate or heavy snow with thunder": icons.cloudSnow,
      "Thundery outbreaks possible": icons.cloudBolt,
      "Blowing snow": icons.cloudSnow,
      Blizzard: icons.cloudSnow,
      Fog: icons.cloud,
      "Freezing fog": icons.cloud,
      "Patchy light drizzle": icons.cloudRain,
      "Light drizzle": icons.cloudRain,
      "Freezing drizzle": icons.cloudRain,
      "Heavy freezing drizzle": icons.cloudRain,
      "Patchy light rain": icons.cloudRain,
      "Light rain": icons.cloudRain,
      "Moderate rain at times": icons.cloudRain,
      "Moderate rain": icons.cloudRain,
      "Heavy rain at times": icons.cloudRain,
      "Heavy rain": icons.cloudRain,
      "Light freezing rain": icons.cloudRain,
      "Moderate or heavy freezing rain": icons.cloudRain,
      "Light sleet": icons.cloudSnow,
      "Moderate or heavy sleet": icons.cloudSnow,
      "Patchy light snow": icons.cloudSnow,
      "Light snow": icons.cloudSnow,
      "Patchy moderate snow": icons.cloudSnow,
      "Moderate snow": icons.cloudSnow,
      "Patchy heavy snow": icons.cloudSnow,
      "Heavy snow": icons.cloudSnow,
      "Ice pellets": icons.cloudSnow,
      "Light rain shower": icons.cloudRain,
      "Moderate or heavy rain shower": icons.cloudRain,
      "Torrential rain shower": icons.cloudRain,
      "Light sleet showers": icons.cloudSnow,
      "Moderate or heavy sleet showers": icons.cloudSnow,
      "Light snow showers": icons.cloudSnow,
      "Moderate or heavy snow showers": icons.cloudSnow,
      "Light showers of ice pellets": icons.cloudSnow,
      "Moderate or heavy showers of ice pellets": icons.cloudSnow,
      "Patchy light rain with thunder": icons.cloudRain,
      "Moderate or heavy rain with thunder": icons.cloudRain,
      "Patchy light snow with thunder": icons.cloudSnow,
      "Moderate or heavy snow with thunder": icons.cloudSnow,
      "Partly cloudy": icons.cloudSun,
      Sunny: icons.sun,
      Clear: icons.sun,
      Cloudy: icons.cloudy,
      Overcast: icons.cloudy,
      Mist: icons.cloudy,
      "Patchy rain possible": icons.cloudRain,
      "Patchy rain nearby": icons.cloudRain,
      "Patchy snow possible": icons.cloudSnow,
      "Patchy light snow": icons.cloudSnow,
      "Light snow": icons.cloudSnow,
      "Patchy moderate snow": icons.cloudSnow,
      "Moderate snow": icons.cloudSnow,
      "Patchy heavy snow": icons.cloudSnow,
      "Heavy snow": icons.cloudSnow,
      "Ice pellets": icons.cloudSnow,
      "Patchy light drizzle": icons.cloudRain,
      "Light drizzle": icons.cloudRain,
      "Freezing drizzle": icons.cloudRain,
      "Heavy freezing drizzle": icons.cloudRain,
      "Patchy light rain": icons.cloudRain,
      "Light rain": icons.cloudRain,
      "Moderate rain at times": icons.cloudRain,
      "Moderate rain": icons.cloudRain,
      "Heavy rain at times": icons.cloudRain,
      "Heavy rain": icons.cloudRain,
      "Light freezing rain": icons.cloudRain,
      "Moderate or heavy freezing rain": icons.cloudRain,
      "Light sleet": icons.cloudSnow,
      "Moderate or heavy sleet": icons.cloudSnow,
      "Patchy light snow": icons.cloudSnow,
      "Light snow": icons.cloudSnow,

      "Patchy sleet possible": icons.cloudSnow,
      "Patchy freezing drizzle possible": icons.cloudSnow,
      "Thundery outbreaks possible": icons.cloudBolt,
      "Blowing snow": icons.cloudSnow,
      Blizzard: icons.cloudSnow,
      Fog: icons.cloudy,
      "Freezing fog": icons.cloudy,
      "Patchy light drizzle": icons.cloudRain,
      "Light drizzle": icons.cloudRain,
      "Freezing drizzle": icons.cloudRain,
      "Heavy freezing drizzle": icons.cloudRain,
      "Patchy light rain": icons.cloudRain,
      "Light rain": icons.cloudRain,
      "Moderate rain at times": icons.cloudRain,
      "Moderate rain": icons.cloudRain,
      "Heavy rain at times": icons.cloudRain,
      "Heavy rain": icons.cloudRain,
      "Light freezing rain": icons.cloudRain,
      "Moderate or heavy freezing rain": icons.cloudRain,
      "Light sleet": icons.cloudSnow,
      "Moderate or heavy sleet": icons.cloudSnow,
      "Patchy light snow": icons.cloudSnow,
      "Light snow": icons.cloudSnow,
      "Patchy moderate snow": icons.cloudSnow,
      "Moderate snow": icons.cloudSnow,
      "Patchy heavy snow": icons.cloudSnow,
      "Heavy snow": icons.cloudSnow,
      "Ice pellets": icons.cloudSnow,
      "Light rain shower": icons.cloudRain,
      "Moderate or heavy rain shower": icons.cloudRain,
      "Torrential rain shower": icons.cloudRain,
      "Light sleet showers": icons.cloudSnow,
      "Moderate or heavy sleet showers": icons.cloudSnow,
      "Light snow showers": icons.cloudSnow,
      "Moderate or heavy snow showers": icons.cloudSnow,
      "Light showers of ice pellets": icons.cloudSnow,
      "Moderate or heavy showers of ice pellets": icons.cloudSnow,
      "Patchy light rain with thunder": icons.cloudRain,
      "Moderate or heavy rain with thunder": icons.cloudRain,
      "Patchy light snow with thunder": icons.cloudSnow,
      "Moderate or heavy snow with thunder": icons.cloudSnow,
    };

    // let setTitle = (t) =>
    //   (win.window.querySelector(".win-titlebar .title").innerText = t);

    let wrapper = win.window.querySelector(".win-content");
    wrapper.classList.add("o-h", "col", "h-100", "w-100");

    let currentWeatherFetch = await fetch("https://wttr.in/?format=j1");
    let currentWeather = await currentWeatherFetch.json();

    new Html("h2")
      .text(currentWeather.nearest_area[0].areaName[0].value)
      .style({
        "font-size": "1.5em",
        "margin-bottom": "0em",
        "margin-top": "0em",
      })
      .appendTo(wrapper);
    new Html("h3")
      .class("label")
      .text(currentWeather.nearest_area[0].country[0].value)
      .style({
        "font-size": "1em",
        "margin-bottom": "0em",
        "margin-top": "0.3em",
      })
      .appendTo(wrapper);

    let weather = new Html("div")
      .class("weather", "card-box")
      .style({
        "margin-top": "1em",
        padding: "1em",
      })
      .appendTo(wrapper);
    let weatherIcon = new Html("span")
      .html(index[currentWeather.current_condition[0].weatherDesc[0].value])
      .appendTo(weather);
    let weatherText = new Html("p")
      .class("bold")
      .style({
        "margin-bottom": "0em",
        "margin-top": "0.3em",
      })
      .text(currentWeather.current_condition[0].weatherDesc[0].value)
      .appendTo(weather);
    let weatherTemp = new Html("p")
      .style({
        "margin-bottom": "0.3em",
        "margin-top": "0em",
      })
      .text(currentWeather.current_condition[0].temp_C + "°C")
      .appendTo(weather);

    document.addEventListener("pluto.lang-change", (e) => {
      win.setTitle(langManager.getString("weather.name"));
    });
  },
  end: async function () {
    // Close the window when the process is exited
    win.close();
    return true;
  },
};

export default pkg;
