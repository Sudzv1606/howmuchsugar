const ONE_LINERS = {
    tier1: [ // 0-3 tsp
        "That's practically health food 🌿",
        "Your pancreas sends its regards",
        "Baby's first sugar rush",
        "This is fine. This is totally fine."
    ],
    tier2: [ // 4-6 tsp
        "That's... a choice.",
        "Your pancreas is filing a complaint",
        "That's not coffee, that's dessert",
        "Sleep is for people who don't do this"
    ],
    tier3: [ // 7-10 tsp
        "Are you okay?",
        "That's a dessert pretending to be a beverage",
        "Wow. Just... wow.",
        "Your pancreas just quit",
        "That's not sugar, that's a lifestyle"
    ],
    tier4: [ // 11+ tsp
        "Your pancreas has left the chat",
        "That's not a drink, that's a science experiment",
        "Absolutely unhinged behavior",
        "I'm not judging. (Yes I am)",
        "Bold of you to assume you'll sleep tonight",
        "That's a lot. That's so many spoons."
    ],
    special: {
        negative: "Sugar subtracts itself? Try again",
        zero: "That's zero spoons. You have successfully avoided sugar."
    }
};

function getOneLiner(teaspoons) {
    if (teaspoons < 0) return ONE_LINERS.special.negative;
    if (teaspoons === 0) return ONE_LINERS.special.zero;

    const tier = teaspoons <= 3 ? 'tier1' :
                 teaspoons <= 6 ? 'tier2' :
                 teaspoons <= 10 ? 'tier3' : 'tier4';

    const tierLines = ONE_LINERS[tier];
    return tierLines[Math.floor(Math.random() * tierLines.length)];
}
