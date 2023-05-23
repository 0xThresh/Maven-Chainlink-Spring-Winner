import process from "process";
import express, { Express, Request, Response} from "express";
import bodyParser from "body-parser";
import { profile } from "../../lens-api/get-lens-profile"

type EAInput = {
    id: number | string;
    data: {
        profileId: string;
        operation: string;
    }
}

type EAOutput = {
    jobRunId: string | number;
    statusCode: number;
    data: {
        result?: any; 
    }
    error?: string;
}

const PORT = process.env.PORT || 8080;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Lens EA Operational");
});

app.post("/", (req: Request, res: Response) => {
    // TODO: Implement operations beyond get-profile
    const eaInputData:EAInput = req.body;
    console.log("Request received: ", eaInputData);

    // Build EA response
    let eaResponse: EAOutput = {
        data:{},
        jobRunId: eaInputData.id,
        statusCode: 0,
    };

    profile(eaInputData.data.profileId)
        .then((response) => {
            eaResponse.data = {result: response.stats.totalPosts}; 
            eaResponse.statusCode = 200;
            eaResponse.jobRunId = eaInputData.id; 
            res.json(eaResponse);
        })
        .catch((error) => {
            console.log("Error: ", error);
            eaResponse.error = error.message;
            eaResponse.statusCode = 500;
            res.json(eaResponse);
        })
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
});