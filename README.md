# sukusyo-kun

capture web page screenshot and save it to GCS.

[![saved screenshot](https://i.gyazo.com/18bf8b17e1ffffd0d56b17bfc3bcbc0c.jpg)](https://gyazo.com/18bf8b17e1ffffd0d56b17bfc3bcbc0c)

[![Cloud Scheduler jobs](https://i.gyazo.com/b4413d146127968232ea6e8e9691105d.png)](https://gyazo.com/b4413d146127968232ea6e8e9691105d)

## コンソールポチポチで作られたもの

- [Pub/Sub topic, Cloud Scheduler job](https://cloud.google.com/scheduler/docs/tut-pub-sub)
- GCS Bucket
- Service Account

## 埋め込まれた定数の一覧
そのうち気合いが出たら剥がす。

- [project name, sevice account, etc...](https://github.com/nna774/sukusyo-kun/blob/5630be3636ebee4a8a2e684a797dd7da0b9f9fa5/package.json#L8-L9)
- [bucket name](https://github.com/nna774/sukusyo-kun/blob/5630be3636ebee4a8a2e684a797dd7da0b9f9fa5/index.ts#L6)

## LICENSE

MIT
