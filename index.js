import { PrismaClient } from '@prisma/client';
import express from 'express';
import axios from 'axios';
const app = express();
const port = process.env.PORT

const prisma = new PrismaClient();

app.get('/skin/:userName', async (req, res) => {
    const { userName } = req.params;

    try {
        const skinData = await prisma.user.findFirst({
            where: { login: userName },
            select: { login: true, skinHash: true }
        });

        if (!skinData) {
            return res.status(404).json({ error: 'User not found' });
        };

        if (!skinData.skinHash) {
            const defaultSkin = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAhFBMVEUAAAAAhKAAhKERHC0UJkQWEQ8iptQjMFEmGhYmPVwwHBIwSW4wmKwwmK0xJR42WYw6JxxDOTVEMCdE0PBE0fBE0fFKLR1KPzpLtvJLtvNRMhtSQTpZUk9bUExbUUxzaGWKf3ifl5LMdlvMd1volmryr4rzr4rzr4v+yKP/yKP/yaP///9mlStlAAAAAXRSTlMAQObYZgAAA8FJREFUWMPtlw1z2zYMhjVWIilrlB1NdabamZ2KVcPl//+/vgBIiXZyie22d71eEeubeAiAJIgURRTbtpaOytqKjuJaId22JUpFAHs1AL2zIh/VLQBWE8pNLkC5qrqurfwE8TfEoOvQedexPghXA9C5JQugHAJOt1hgaRRInwgve4inY/H4iFPmu21FFQi+WNhCb2lIs2B2MFIo58MHx6ED37sOvoNGtggS19iq6wSAby8nENqn2IHQ8QvWbjG1kv4SK3sOQPDJdWtDsHaaaErSnKzkFxuRr3JE5gKoqDkUnz+F8OkZoJZf0YHJ/f6MpGnX2sMhhD0khMPBtnZeUlUEHA5FQd/l7kR47u8Px+P9vff398fjYS/LoWKKAOR7Ucj3cwDa7vfH4zE8PgZc9ntW5v6TBfydx5++v3SjNKbc3d3t0rNzCuLchyjp/QDx3n95AYB++bDbPcwAxQJACVkA//SDDtMYXgfc3eWAaZoB5Qzo+157/wqAXHiApGetaEopXYqYGTD0Q5j86TpB58bUtbSsa+O01oOjFakG3Dot8dADuu8RA+24xb8LAEp1AuCOvg7URquBCARhFRYnj+DNAOibpmkMuVHWEdCjoeoTgCUCnOLfkANqAECBlHXTuEiI+k7nwupy5C7UtRDKEpawjSD01F3sm88fYwScfM4sgAMNUQy5UStqwQZzY6UkBsr97WR+/cVzTGcABN9ICCmIHHHqlBGkLxI4030dR0yEz8h7yxwomzUkDoQxivvnESMbFsD/TPAsGOUZwOpr9oKHQ7GPKeaIWgxfEBOQsvz09QTQ1NvtZrVa8SwAQOUxYHc5riE8CYAlA2w2W5INMVabzYaCDgf4R/fsh3LDFKA1jqI/Zuth9zDLjpY0T22cPsjF6J7nsPZPnkIg246fQvE7ypIO/sjPEllfcRXrLCP9CsIL+jvV101a2831gKZeHuobACzb7feug/9+bFjP6wVKcJROLweAkNcLtLOG8YosxICsXqC0Fsb3LMjywXm9gLKgvzgP8j5PWyUn19poSfKpOtAXArDLykZjeF9IW412+qIRMJhQss00ZaoH0l71LoALBbGAdv1S6gEXywPlLrHA1LzZwoX1unRpu5ftakj54CQ/nFpAurTdSsmgYs3IHNhygQtSr5lSjKB6YJT/g2hTG1/XylY0V1r8XHLdleqBSPBvJgVKBxL8+dlQPTAtgDf+m5NaiVygfX67jbVTqgfeBmT5gKuEWDJAVqkeCFQgIBrvroPzeiHVA8Hj77xOhnwDY3h2QwOM4SYAAAAASUVORK5CYII='
            res.set('Content-Type', 'image/png');
            return res.send(Buffer.from(defaultSkin.split(',')[1], 'base64'));
        };

        const urlS3 = `${process.env.S3_PUBLIC_URL}/${process.env.S3_BUCKET}/skin/${skinData.skinHash.substring(0, 2)}/${skinData.skinHash}`;
        const response = await axios(urlS3, { responseType: 'arraybuffer'});
        res.set('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/cape/:userName', async (req, res) => {
    const { userName } = req.params;

    try {
        const capeData = await prisma.user.findFirst({
            where: { login: userName },
            select: { login: true, capeHash: true }
        });

        if (!capeData) {
            return res.status(404).json({ error: 'User not found' });
        };

        if (!capeData.capeHash) {
            return res.status(404).json({ error: 'Cape not found' });
        };

        const urlS3 = `${process.env.S3_PUBLIC_URL}/${process.env.S3_BUCKET}/cape/${capeData.capeHash.substring(0, 2)}/${capeData.capeHash}`;
        const response = await axios(urlS3, { responseType: 'arraybuffer'});
        res.set('Content-Type', 'image/png');
        res.send(response.data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});