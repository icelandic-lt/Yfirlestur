import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log('body: ', body);
    const { texts } = body;
    console.log('In Post, text: ', texts);
    console.log('API KEy: ', process.env.GREYNIR_SEQ_API_KEY);

    try {
        const apiKey = process.env.GREYNIR_SEQ_API_KEY;
        if (!apiKey) {
            throw new Error('API key is not defined');
        }

        // const response = await fetch(
        //     'http://birta.mideind.is:8123/grammar_nn/',
        //     {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'X-API-Key': apiKey,
        //         },
        //         body: JSON.stringify({
        //             text: texts,
        //         }),
        //     }
        // );
        // const newTexts = await response.json();
        // console.log('newTexts from backend: ', newTexts);
        // TODO: Remove this - temporary hack to test the UI
        const newTexts: string[] = [];
        texts.forEach((t: string) => {
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
        return NextResponse.json(newTexts);

        // // const data = await response.json();
        // const data = newTexts.corrected_text;
        // console.log('response data: ', data);
        // return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: 'Error', error }, { status: 500 });
    }
}
