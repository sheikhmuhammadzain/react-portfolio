import express from "express"
import { createLiveToken } from "../controllers/liveController.js"

const router = express.Router()

router.post("/token", createLiveToken)

export default router
