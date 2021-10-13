import { Typography, Row, Col } from 'antd';
const { Paragraph, Link, Title, Text } = Typography

const killExample = `
          "_id": ObjectId("615aed1b18bba3339227f096"),
          "tick" : NumberInt(292565),
          "equipmentValue" : NumberInt(4400),
          "freezeTimeEndEquipmentValue" : NumberInt(4400),
          "cashSpentInRound" : NumberInt(4200),
          "hasC4" : false,
          "health" : NumberInt(42),
          "armour" : NumberInt(90),
          "isScoped" : false,
          "weapon" : "weapon_knife",
          "bulletsInMagazine" : NumberInt(0),
          "position" : {
              "x": -569.9893188476562,
              "y" : 1676.9215087890625,
              "z" : -115.70608520507812,
              "_id" : ObjectId("615aed1b18bba3339227f097")
          },
          "placeName" : "MidDoors",
          "type" : "hurt_victim",
          "__v" : NumberInt(0),
          "player" : ObjectId("615aecff18bba3339227bc96")
        `

export default function About() {
  console.log('about')
  return (
    <div>
      <Row gutter={24} justify={'center'}>
        <Col span={9}>
          <Title>About</Title>
          <Paragraph>
            <Link href="https://github.com/niekcandaele/aws-graviton-hackathon/">Bantr</Link> is an application for data analysis of Counter Strike Global Offensive (CSGO) matches.
            The application is built for the <Link href="https://awsgraviton.devpost.com" target="_blank">AWS Graviton hackathon</Link>.
          </Paragraph>

          <Paragraph>
            CSGO provides functionality to record a game and save it in a so called demofile. It allows you to replay the game from every player's perspective.
            A demofile contains all the data of every event in a game.
          </Paragraph>

          <Paragraph>
            Bantr retrieves demofiles and parses them to extract these in-game events. An example of an event could be <Text code>player1 kills player2</Text>.
            Such an event would look like the following:
            <pre>{killExample}</pre>
          </Paragraph>

          <Paragraph>
            A demo file can easily contain more than 100MB in raw data. That's a <Link href="" >lot </Link>!
            We use that data to show statistical information such as a global statistics stretching over multiple games, chronological game overview statistics and machine learning predictions.
          </Paragraph>

          <Paragraph>
            Without going into detail, a game consists out of a set of rounds.The first team to win 16 rounds, wins the game. Within each
            round we predict the winner based on events that happened during the round.
          </Paragraph>

          <Paragraph>Happy hacking!</Paragraph>
          <Paragraph>Emiel and Niek</Paragraph>
        </Col>
      </Row>
    </div>
  )
}