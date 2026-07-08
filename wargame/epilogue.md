# Epilogue — the street and Mummotunneli

Line grammar: `NAME: text` is a spoken voice line (names in CAPS: MARIA, EETU,
RAJA, TALKOOT, NOKIA, VELKA, METSÄ, MUMMOTUNNELI, YOUR FINNISH GENES).
`> text` is narration. Lowercase `key: value` lines are settings the site reads.
{tokens} interpolate from the playthrough: {role} {metric} {recap} {met} {missed}
{trust} {sov_share}. Keep section slugs; edit all text freely.

The engine picks sections by the scenario: marja/eetu by their final rung (5 best
… 1 worst), plus a react-* line by what THE PLAYER's own choices did to them
(hurt / helped / neutral, computed by counterfactual replay; {action} and {alt}
name the decisive choice); raja by the stack decision (euro = sovereign,
us = the lane, split = never chose); talkoot by trust and drift; nokia by which
miracle exists; velka by goals met and whether the dividend was paid.

## street/opening

You, the {role}, walk past the Stockmann department store on Aleksanterinkatu. {metric} {recap}

## street/recap-all
Six years ago you vowed to answer for three things, and all three held. Most decades take more and give less.

## street/recap-some
Six years ago you vowed to answer for three things. {met} held. What did not hold, {missed}, is the price of the path Finland took.

## street/recap-none
Six years ago you vowed to answer for three things. None of them held. The decade went another way, and you were in the room when it turned.

## street/roles
PM: previous Prime Minister | weathered Prime Minister | re-elected Prime Minister
SAK: pensioned union chief | union chair with one fight left | union chair who signed the decade
COUNTY: retired county director | county director with tired shoes | county director whose queues bent
TI: former industry lobbyist | industry federation head, still invited | industry federation head with full order books
HVK: reassigned preparedness chief | security-of-supply chief nobody films | security-of-supply chief whose drill worked
AALTO: emeritus rector | rector between intakes | rector whose graduates stayed
STARTUP: founder of a company that exists elsewhere | founder mid-round | founder who never had to choose a passport

## street/maria-intro
> A woman in her fifties stops you. Her name, she says, is Maria.

## street/marja-5
MARIA: Hey — sorry to interrupt. I know you: one of the people who decided the decade. I run the state's reform unit now; before that, AI strategy at Kela.
MARIA: My unit is permanent. The pilot I couldn't ship in 2021 is national policy. My name is in the annex. That does not happen in most versions of this country.

## street/marja-4
MARIA: Sorry to interrupt — I know your face from the news. You were one of the ones deciding. I lead AI strategy at Kela.
MARIA: It worked, mostly. Deployment grows under rules I helped write. Slow, argued, mine. I will take it.

## street/marja-3
MARIA: Excuse me — you decided these things, didn't you. I do AI strategy at Kela. I have rehearsed this speech for years and it still is not quite a complaint.
MARIA: Nothing that was decided ever reached the machine I work in. I am still half-inside, designing for a state that buys the slides and defers the change.

## street/marja-2
MARIA: You. One minute. I know your face; you were one of the ones deciding. I was hired to run AI strategy at Kela. I came back to this country to fix its systems.
MARIA: Instead I run cleanup for choices that were made without a design. Ten years of expertise, spent mopping. I still have to justify coming back. To myself, mostly.

## street/marja-1
MARIA: I recognize you — one of the deciders. Don't worry, I won't take much of your time. I used to run AI strategy at Kela. Twice, actually.
MARIA: I left a second time, in the spring of 2032. Staying had stopped being a plan and become a habit. That one I do not narrate as a career move.

## street/marja-react-hurt
MARIA: And you — I checked the record. Everyone can, these days. When you chose {action}, that was the door closing on people like me. {alt} was right there. You saw it. You looked away.

## street/marja-react-helped
MARIA: I checked the record before deciding whether to be angry with you. When it mattered, you chose {action}. You held the door open. It did not fix everything. It was held.

## street/marja-react-neutral
MARIA: I looked you up once, to know whom to be angry at. Nothing you ever chose touched my life, one way or the other. I still have not decided whether that is better.

## street/eetu-intro
> Another passer-by has drifted closer. He does not raise his voice.

## street/eetu-5
EETU: Sorry — I couldn't help overhearing. Eetu. Machine-learning engineer; I build and certify the public platform.
EETU: The job my degree was for. Years late, and real.

## street/eetu-4
EETU: Couldn't help overhearing. Eetu — ML engineer, class of 2024.
EETU: I do real ML work, in Finland. The frontier is elsewhere. The work is mine.

## street/eetu-3
EETU: Couldn't help overhearing. Eetu. ML engineer, on paper.
EETU: I glue systems together for whoever is paying. It was supposed to be temporary.

## street/eetu-2
EETU: Couldn't help overhearing. Eetu. Class of 2024.
EETU: I'm still between things. The country never quite hired me. Nobody decided that. That is the point. Somebody should have.

## street/eetu-1
EETU: Couldn't help overhearing. Eetu — ML engineer. I left in 2032; I'm only visiting.
EETU: Finland kept the student debt. Another country got the decade.

## street/eetu-react-hurt
EETU: I read the minutes, you know. My whole class did. You chose {action}. There was {alt}, on the same page. That is all I wanted to say to your face.

## street/eetu-react-helped
EETU: For what it's worth — I know what you chose when it counted. {action}. Some of us noticed. Not many. Me.

## street/eetu-react-neutral
EETU: I don't blame you personally. I checked. Nothing you decided ever reached me. Somehow that is the worst version.

## street/shivers
> A thin, freezing wind finds your cheek. Above you, the clouds look like small island countries, independent, self-reliant. You don't have the patience for this.
MUMMOTUNNELI: Psst. Come here.
> You look at a dark alley.

## street/enter
button: Enter

## tunnel/intro
> You emerge from the dark corridor into a narrow, open alley. Someone has strung a single light. Under a terrace umbrella, five animals sit around a table that is too small for them: a cow, a pig, an elk, a bear and a dog.
YOUR FINNISH GENES: Instinctively, you know what these are. Spirits. The old keepers.
> The dog is Talkoot, the ghost of consensus. The bear is Raja, the shiver of the east. The cow is Nokia, the ghost of the miracle past. The pig is Velka, the Lutheran soul. The elk is Metsä, the one who rarely speaks.
METSÄ: Join us, space monkey.
+ Sit at their table

## tunnel/hub
first: The table waits. Whom do you turn to first?
again: The table waits. Whom do you turn to now?

## tunnel/spirits
RAJA: The bear, Raja
TALKOOT: The dog, Talkoot
NOKIA: The cow, Nokia
VELKA: The pig, Velka
METSÄ: The elk, Metsä

## raja/open
> You turn to the bear. It was already looking at you.
RAJA: The vikings landed here once. Had a look. Rowed on and founded Russia instead. Too much work, this place, for too little plunder.
RAJA: Now tell me about the new dependence. The one made of lightning. My scouts report cables and contracts. I understand neither.
> The cow lifts its head from its glass.
NOKIA: (drunkenly) Bear. Sweet bear. The machines that run their benefits offices, their hospitals, their permits — they think with engines. The engines live in halls. The halls have owners. The owners have flags. It is your border, Raja, running through every computer in the country. You cannot see it because it is indoors.
RAJA: Indoors. I hate indoors.
RAJA: And these engine-halls. Whose flag?

## raja/euro
NOKIA: Ours, near enough. They took the slower engine they could open and inspect. Months behind the frontier, and entirely theirs to switch off, switch on, and argue about in their own courts.
RAJA: Behind the frontier and on our own ground. I have defended worse positions with less. I approve.
VELKA: It cost—
RAJA: Defensible positions always do.

## raja/us
NOKIA: Theirs. The good engines, the fast ones. Attested, audited, guaranteed — and rented. The state runs in a lane someone else owns.
RAJA: A lane is a corridor. Corridors have doors. Doors have keepers. You have been a corridor before. Ask Karelia what the rent was.
TALKOOT: The terms are written down. Everyone signed.
RAJA: Paper holds until weather. I am weather.

## raja/split
NOKIA: Nobody chose. Three engines, two flags, one country. Each ministry runs on whatever was procured that quarter.
RAJA: Nothing decided. The ice does not care. It forms anyway, and someone will walk across it.

## raja/close
RAJA: The country is still on the map. Start there. That was never a given. I have counted one thousand three hundred and forty kilometres every night since 1944, and some nights the count felt optimistic.

## talkoot/open
> The dog sits up. Somewhere, faintly, you smell coffee and sawdust.
TALKOOT: Eleven months of the year, this is the most organised society on earth. Contracts, agreements, everyone lifting on the count of three.
METSÄ: And one month of anarchy in the woods. No addresses, no minutes, berries. The month is not a holiday from the system. The month is why the system is obeyed.
TALKOOT: So the question is never the machine. The question is the count of three. Did more hands come to the table on your watch, or fewer?

## talkoot/better
TALKOOT: More, by my count. The wards kept their people, and the people kept the habit of agreeing. The habit is the infrastructure. Everything else is fittings.
VELKA: Trust stands at {trust}. I do not book feelings, but I book what they cost: strikes not held, queues not rioted, elections believed. A cheap decade, all told. The cheapest thing you built.
TALKOOT: You are leaving the barn bigger than you found it. That is the entire liturgy. Everything else is commentary.

## talkoot/worse
TALKOOT: Fewer. People learned that the machine decides, and stopped coming to the meeting. An agreement nobody attends has another name. It is called a ruin.
VELKA: Trust stands at {trust}. Feelings are not my department, but their interest rates are. Every future deal in this country now costs more to close. Distrust compounds quietly.
TALKOOT: Barns can be raised twice. But the second time, you carry the beams past the people who watched the first one burn.

## nokia/open
> The cow pushes its glass away. It is suddenly, dangerously sober.
NOKIA: Ask me. Go on. Ask me if there is a new me.

## nokia/miracle-stack
NOKIA: Because there is, and nobody has noticed, which is how I know it is real. The boring one. An engine anyone may open, and the paperwork that proves it. Other countries are buying the proof. Nobody writes songs about audit trails.
NOKIA: My miracle had a ringtone. This one has a signature. I was louder. It will be older.
VELKA: Margins?
NOKIA: Terrible. Longevity: eternal. You would not understand, pig. It is a rhetoric thing.

## nokia/miracle-compact
NOKIA: They are calling it the Finnish model again. Imagine. Not a device this time — a treaty between a machine and its country. Retraining you can sue for. A dividend with an address. The export product is the signature page.
NOKIA: It does not fit in a pocket and it will never be envied at a dinner party. I am trying to be proud of it. Some nights I manage.

## nokia/no-miracle
NOKIA: No. There is no new me. There are eleven small maybes and one large refusal to choose among them.
NOKIA: You know what dying taught me? Nothing dies of losing. Things die of winning at the wrong thing — or of never placing the bet. There were a dozen other product lines on my table in 2007. Any one of them could have carried the town. Winning was never the scarce material. Wanting one thing, together, long enough — that is the scarce material.
> The cow reaches for the glass again.
NOKIA: (quietly) Maamme köyhä on… mutta ei sen tarvitse jäädä.

## velka/open
> The pig opens a book that was not there a moment ago. The reading begins.

## velka/met-high
VELKA: Your own page first. All three goals met. Before the toast: whose were not met, so that yours could be? Someone left this table lighter. I am merely keeping the books.

## velka/met-mid
VELKA: Your own page first. Two entries in the black, one written off. I have closed worse decades. I will say this once and then deny it: acceptable.

## velka/met-low
VELKA: Your own page first. The ledger records everything you bought. It is silent on what you wanted. That silence is the most expensive line in the book.

## velka/paid
VELKA: Now the country's page. The machine's proceeds were assigned: retraining funded, care reinvested, the levy capped and sunset. For once the dividend has an address. I mark the society account: serviced. Not settled — serviced. It is the best any generation manages.

## velka/unpaid
VELKA: Now the country's page. The gains went to the books, and the books are beautiful. The society account shows arrears nobody scheduled. Unassigned gains are how countries buy their next crisis at a discount.
VELKA: And for the record: every path was affordable. Even the generous ones. I ran the numbers while everyone was being poetic. What we could not afford was the not-choosing. Indecision compounds. It is the only debt with no ceiling.

## velka/coda
TALKOOT: Debt is the wrong word, pig, and you know it. Nobody owes and nobody collects. There is a commons and there is its keeping. The point was never to pay anything back. The point is that the well keeps working so that no one has to count.
VELKA: Uncounted wells run dry politely.
METSÄ: Debt. Commons. Constructs of the space monkeys. The forest holds no accounts. Eventually love is communism and communism is love, and neither appears in your book, pig.
> The pig writes something down anyway. Old habits.

## metsa
> The elk regards you the way weather regards a picnic.
METSÄ: I do not know your borders. I do not know your growth. I know the ice comes later every year and leaves earlier, and that somewhere south of here, the ground itself is walking north.
METSÄ: You space monkeys have a word for the cause. Greed, is it? I never meet it. I only meet its footprints. Warmer rain. Quieter birds. Large footprints, for such a small monkey.
VELKA: There is a term for this. Ecological debt. The species is heavily leveraged against—
METSÄ: There it is. Monkey exceptionalism: even your humility must be bookkept. The cosmos holds no ledger, pig. The lake does not lend. It only remembers.
TALKOOT: We raised the emissions law together. Every hand on it—
METSÄ: The forest noticed. The forest does not thank. Noticing is the thanks.
METSÄ: Keep your machine. Teach it the paperwork. But leave the month alone — the one with the berries. If you automate the silence, there will be nowhere left to hear yourselves stop.

## finale/open
> The candle is low. The five look at you all at once, the way a country sometimes does.
> The dog puts its head on the table and looks up at you. What should this country want?

## finale/option-1
label: "To be safe."
RAJA: Safety is not a want. It is a floor. You are describing a basement and calling it a house.
VELKA: Basements are affordable.
TALKOOT: Nobody raises a barn for the basement.

## finale/option-2
label: "To be first at something again."
NOKIA: YES. Finally. Give me the keys—
METSÄ: First to where?
> The cow does not answer. Nobody has ever answered.

## finale/option-3
label: "To be a place worth coming back to."
> The elk looks at you for a long time. From an elk, this is applause.
TALKOOT: Then you know what the machine was for. It does the paperwork. The coming back is yours to build, and it takes all the hands. Even the ones lifting badly.

## finale/end
> The candle gutters. Nobody moves to refill anything.
VELKA: This meeting was unminuted. It always is.
MUMMOTUNNELI: The wind again, through the alley. Somewhere on Aleksanterinkatu, Maria is still explaining and Eetu is still listening. There are many ways to win this country, and all of them are built the same way: knowing what you want, and carrying it with others. If you do not know what you want, any path will take you there. You have just walked one.
> You stand to leave. The elk looks at you. You have absolutely no idea what it is thinking. You suspect this is what it's like for everyone, and you are wrong.
