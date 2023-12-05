import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log('body: ', body);
    const { text } = body;
    console.log('In Post, text: ', text);
    console.log('API KEy: ', process.env.GREYNIR_SEQ_API_KEY);

    try {
        const apiKey = process.env.GREYNIR_SEQ_API_KEY;
        if (!apiKey) {
            throw new Error('API key is not defined');
        }

        // const response = await fetch('https://api.greynir.is/grammar/', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-API-Key': apiKey,
        //     },
        //     body: JSON.stringify({
        //         text: text,
        //         options: {
        //             annotate_unparsed_sentences: true,
        //             suppress_suggestions: false,
        //             ignore_words: [],
        //             ignore_rules: [],
        //             custom: '',
        //             readability_analysis: false,
        //             rare_word_analysis: false,
        //         },
        //     }),
        // });
        // TODO: Remove this - temporary hack to test the UI
        const newTexts: string[] = [];
        text.forEach((t) => {
            // Select random words from the text and replace them with either "breyting", "prufa" or "innsetning"
            const words = t.split(' ');
            const replacementWords = ['breyting', 'prufa', 'innsetning'];
            const randomNr = Math.floor(Math.random() * words.length);
            for (let i = 0; i < randomNr; i++) {
                const randomWordNr = Math.floor(Math.random() * words.length);
                const randomReplacementWordNr = Math.floor(
                    Math.random() * replacementWords.length
                );
                words[randomWordNr] = replacementWords[randomReplacementWordNr];
            }
            const newText = words.join(' ');
            console.log('newText: ', newText);
            newTexts.push(newText);
        });

        // const data = await response.json();
        const data = newTexts;
        console.log('response data: ', data);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Error', error }, { status: 500 });
    }
}
