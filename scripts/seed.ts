import { config } from "dotenv";

config({ path: ".env.local" });

import { getDb } from "../src/lib/db/client";
import { entries, NewEntryRow } from "../src/lib/db/schema";

const seedRows: NewEntryRow[] = [
  {
    type: "milestone",
    title: "Основание корпорации",
    body: "Горстка пилотов, уставших от вечной нестабильности нул-сека, основала корпорацию, стремясь к чему-то более постоянному, чем флот на один вечер.",
    eventDate: "2019-01-01",
    datePrecision: "year",
    authorId: "user_founder",
    authorName: "Ария Восс",
    status: "approved",
    createdAt: "2019-01-01T00:00:00.000Z",
    updatedAt: "2019-01-01T00:00:00.000Z",
  },
  {
    type: "story",
    title: "Как я стал шахтёром",
    body: "Вступал, думая, что буду летать на фрегатах днями напролёт. Три месяца спустя у меня было два Hulk'а, и я знал цены на руду наизусть. Ни капли не жалею.",
    eventDate: "2019-06-01",
    datePrecision: "year",
    authorId: "user_miner",
    authorName: "Денис Оконкво",
    status: "approved",
    createdAt: "2019-06-01T00:00:00.000Z",
    updatedAt: "2019-06-01T00:00:00.000Z",
  },
  {
    type: "milestone",
    title: "Закреплена первая система в нул-секе",
    body: "После месяцев аренды мы захватили и удержали собственную систему. Первый Sotiyo встал уже через неделю, и с тех пор мы не оглядывались назад.",
    eventDate: "2020-03-01",
    datePrecision: "month",
    authorId: "user_founder",
    authorName: "Ария Восс",
    status: "approved",
    createdAt: "2020-03-01T00:00:00.000Z",
    updatedAt: "2020-03-01T00:00:00.000Z",
  },
  {
    type: "story",
    title: "Мой первый флотовый бой",
    body: "ФК сказал: «Строимся, крейсера первого тира, без вопросов». Я потерял свой первый корабль за девяносто секунд и тут же пересел на новый. Лучшие потраченные исковые.",
    eventDate: "2020-11-14",
    datePrecision: "day",
    killboardUrl: "https://zkillboard.com/kill/98765432/",
    authorId: "user_newbro",
    authorName: "Тома Рейес",
    status: "approved",
    createdAt: "2020-11-14T00:00:00.000Z",
    updatedAt: "2020-11-14T00:00:00.000Z",
  },
  {
    type: "milestone",
    title: "Великое переселение в червоточину",
    body: "Потери в войне за суверенитет вынудили корпорацию полностью переехать в червоточину класса C5. Планировалось, что это временно. Мы там до сих пор.",
    eventDate: "2022-08-01",
    datePrecision: "month",
    youtubeUrl: "https://www.youtube.com/watch?v=00000000000",
    authorId: "user_logistics",
    authorName: "Прия Накамура",
    status: "approved",
    createdAt: "2022-08-01T00:00:00.000Z",
    updatedAt: "2022-08-01T00:00:00.000Z",
  },
  {
    type: "milestone",
    title: "Слияние с альянсом «Пепельное согласие»",
    body: "Официальные переговоры о слиянии завершились после двух месяцев совместных операций. Ожидает одобрения офицеров, прежде чем попасть в летопись.",
    eventDate: "2026-06-02",
    datePrecision: "day",
    authorId: "user_founder",
    authorName: "Ария Восс",
    status: "pending",
    createdAt: "2026-06-02T00:00:00.000Z",
    updatedAt: "2026-06-02T00:00:00.000Z",
  },
];

async function main() {
  const db = getDb();
  await db.insert(entries).values(seedRows);
  console.log(`Seeded ${seedRows.length} entries.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
