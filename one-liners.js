const ONE_LINERS = {
    tier1: [ // 0-10g (~0-2.5 tsp)
        "That's practically health food 🌿",
        "Your pancreas sends its regards",
        "Baby's first sugar rush",
        "This is fine. This is totally fine.",
        "A modest amount. Respectable.",
        "Could be worse. Could be soda.",
        "Cute. A little baby sugar.",
        "Your pancreas is mildly amused"
    ],
    tier2: [ // 11-20g (~2.5-5 tsp)
        "That's... a choice.",
        "Your pancreas is filing a complaint",
        "That's not coffee, that's dessert",
        "Sleep is for people who don't do this",
        "Welcome to flavortown™",
        "That's a solid dessert masquerading as breakfast",
        "Your pancreas is taking a smoke break",
        "Interesting lifestyle choice there",
        "That's one chocolate bar's worth of chaos"
    ],
    tier3: [ // 21-30g (~5-7 tsp)
        "Are you okay?",
        "That's a dessert pretending to be a beverage",
        "Wow. Just... wow.",
        "Your pancreas just quit",
        "That's not sugar, that's a lifestyle",
        "Two chocolate bars walked into a bar...",
        "Your pancreas has updated its resume",
        "That's literally a can of soda's worth",
        "Bold of you to assume you need energy",
        "Your pancreas is googling 'how to escape'"
    ],
    tier4: [ // 31-40g (~7-10 tsp)
        "Your pancreas has left the chat 💀",
        "That's not a drink, that's a science experiment",
        "Absolutely unhinged behavior",
        "I'm not judging. (Yes I am)",
        "Bold of you to assume you'll sleep tonight",
        "That's a lot. That's so many spoons.",
        "Three candy bars. Why. Just why.",
        "Your pancreas is now legally separate from you",
        "That's basically a milkshake at this point",
        "Your pancreas filed for early retirement"
    ],
    tier5: [ // 41-60g (~10-14 tsp)
        "Your pancreas has left the planet",
        "That's not food, that's a challenge",
        "Your pancreas is contacting HR",
        "That's FOUR candy bars. Who hurt you?",
        "Absolutely feral behavior",
        "Your pancreas is building an escape tunnel",
        "That's like drinking two sodas back to back",
        "I'm calling the sugar police",
        "Your pancreas no longer recognizes you",
        "That's an entire cake's worth of 'why'"
    ],
    tier6: [ // 61g+ (~15+ tsp)
        "Your pancreas has left the dimension",
        "That's not a beverage, that's a war crime",
        "Your pancreas has been reincarnated as a turtle",
        "That's basically eating sugar from the bag",
        "Absolutely legendary chaos",
        "Your pancreas changed its name and moved away",
        "I'm impressed and concerned",
        "That's a whole birthday cake in one go",
        "Your pancreas is now living on a farm upstate",
        "Doctors hate this one weird trick"
    ],
    special: {
        negative: "Sugar subtracts itself? Try again 🤨",
        zero: "That's zero spoons. You have successfully avoided sugar. ✨"
    }
};

function getOneLiner(teaspoons) {
    if (teaspoons < 0) return ONE_LINERS.special.negative;
    if (teaspoons === 0) return ONE_LINERS.special.zero;

    const tier = teaspoons <= 2.5 ? 'tier1' :
                 teaspoons <= 5 ? 'tier2' :
                 teaspoons <= 7 ? 'tier3' :
                 teaspoons <= 10 ? 'tier4' :
                 teaspoons <= 14 ? 'tier5' : 'tier6';

    const tierLines = ONE_LINERS[tier];
    return tierLines[Math.floor(Math.random() * tierLines.length)];
}
