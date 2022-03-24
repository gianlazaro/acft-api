const express = require("express");
const app = express();
const data = require("./data");
const PORT = process.env.PORT || 3000;

app.use(express.json());

function getScore(exercise, age, sex, rawScore) {
  let snip = sex + age;

  for (let i = 0; i < data[exercise].length; i++) {
    if (data[exercise][i][snip] == rawScore) {
      return data[exercise][i].points;
    }
  }
}

function getRanges(sex, age) {
  let ranges = {
    mdl: [],
    spt: [],
    hrp: [],
    sdc: [],
    plk: [],
    "2mr": [],
  };

  let snip = sex + age;

  for (let key in data) {
    for (let j = 0; j < data[key].length; j++) {
      if (data[key][j].hasOwnProperty(snip) && data[key][j][snip] !== "---") {
        ranges[key].push(data[key][j][snip]);
      }
    }
  }

  return ranges;
}

app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.status(200).send("it works");
});

app.get("/ranges/:age/:sex/", (req, res) => {
  const { age, sex } = req.params;
  res.header("Access-Control-Allow-Origin", "*");
  let val = getRanges(sex, age);
  res.status(200).send(val);
});

app.get("/:exercise/:age/:sex/", (req, res) => {
  const { exercise, age, sex } = req.params;

  let arr = [];
  let snip = sex + age;
  for (let i = 0; i < data[exercise].length; i++) {
    if (data[exercise][i][snip] && data[exercise][i][snip] !== "---")
      arr.push([
        data[exercise][i][snip],
        getScore(exercise, age, sex, data[exercise][i][snip]),
      ]);
  }

  res.header("Access-Control-Allow-Origin", "*");
  res.status(200).send({
    age,
    sex,
    exercise,
    arr,
  });
});
app.listen(PORT, () => console.log(`ALIVE PORT ${PORT}`));
