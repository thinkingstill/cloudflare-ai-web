import {handleErr, imageResponse, imageResponseV2} from "~/utils/helper";
import {WorkersBodyImage, WorkersReqImage} from "~/utils/types";

export default defineEventHandler(async (event) => {
    const body: WorkersReqImage = await readBody(event)
    const {model, messages, num_steps} = body

    const workersBody: WorkersBodyImage = {
        prompt: messages[0].content,
        num_steps
    }

    const res = await fetch(`${process.env.CF_GATEWAY}/ai/run/${model}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.CF_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(workersBody)
    })

    if (!res.ok) {
        return handleErr(res)
    }
    if (model.includes("flux-1-schnell")) {
        const data = await res.json()
        return imageResponseV2(data.result.image)
    } else {
        return imageResponse(res)
    }
})
