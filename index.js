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

app.get("/:exercise/:age/:sex/:rawScore", (req, res) => {
  const { exercise, age, sex, rawScore } = req.params;
  let score = getScore(exercise, age, sex, rawScore);

  res.header("Access-Control-Allow-Origin", "*");
  res.status(200).send({ score });
});

app.get("/ranges/:sex/:age", (req, res) => {
  const { sex, age } = req.params;
  res.header("Access-Control-Allow-Origin", "*");
  res.status(200).send(getRanges(sex, age));
});

app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.status(200).send("it works");
});

app.listen(PORT, () => console.log(`ALIVE PORT ${PORT}`));
