const drawModel = require('../models/drawModel');
const betModel = require('../models/betsModel');
const settingsModel = require('../models/settingsModel');
const userModel = require('../models/userModel');

exports.getResults = async (req, res) => {
    try {
        const byDate = req.params.byDate;

        const draws = await drawModel.draw.find({ date: byDate }, '_id date typeId placeId numbers');
        const bets = await betModel.bet.find({ drawDate: byDate }, '_id userId date numbers drawTypeId amount');

        const results = [];

        for (let i = 0; i < draws.length; i++) {
            for(let j = 0; j < bets.length; j++) {
                if(draws[i].typeId === bets[j].drawTypeId && draws[i].numbers === bets[j].numbers) {
                    const [drawType] = await settingsModel.drawType.find({ id: draws[i].typeId }, 'name');
                    const [place] = await settingsModel.place.find({ id: draws[i].placeId }, 'name');
                    const [user] = await userModel.user.find( {id: bets[j].userId }, 'username firstName lastName');

                    results.push({
                        Bet_ID: bets[j]._id,
                        Draw_ID: draws[i]._id,
                        Betted_Date: bets[j].date,
                        Draw_Date: draws[i].date,
                        Draw_Type: drawType.name,
                        Place: place.name,
                        User: `${user.firstName} ${user.lastName}`,
                        Numbers: draws[i].numbers,
                        Amount: bets[j].amount
                    })
                }
            }
        }

        // const results = await drawModel.draw.aggregate([
        //     {
        //         $match: {
        //             date: byDate
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "bets",
        //             let: { drawDate: "$drawDate", drawNumbers: "$numbers", drawType: "$drawTypeId" },
        //             pipeline: [
        //                 {
        //                     $match: {
        //                         $expr: {
        //                             $and: [
        //                                 // { $eq: ["$date", "$$drawDate"] },
        //                                 { $eq: ["$typeId", "$$drawType"] },
        //                                 { $eq: ["$numbers", "$$drawNumbers"] },
        //                             ]
        //                         }
        //                     }
        //                 },
        //             ],
        //             as: "bet"
        //         }
        //     },
        //     {
        //         $unwind: "$bet"
        //     },
        //     {
        //         $lookup: {
        //             from: "users",
        //             localField: "bet.userId",
        //             foreignField: "id",
        //             as: "user"
        //         }
        //     },
        //     {
        //         $unwind: "$user"
        //     },
        //     {
        //         $lookup: {
        //             from: "drawtypes",
        //             localField: "typeId",
        //             foreignField: "id",
        //             as: "drawtype"
        //         }
        //     },
        //     {
        //         $unwind: "$drawtype"
        //     },
        //     {
        //         $lookup: {
        //             from: "places",
        //             localField: "placeId",
        //             foreignField: "id",
        //             as: "place"
        //         }
        //     },
        //     {
        //         $unwind: "$place"
        //     },
        //     {
        //         $project: {
        //             _id: 1,
        //             date: 1,
        //             numbers: 1,
        //             "place.name": 1,
        //             "drawtype.name": 1,
        //             "user.username": 1,
        //             "user.firstName": 1,
        //             "user.lastName": 1,
        //             "bet.userId": 1,
        //             "bet.amount": 1,

        //         }
        //     }
        // ]);

        // const resultsObj = [];

        // results.forEach(result => {
        //     resultsObj.push({
        //         Bet_ID: result._id,
        //         Date: result.date,
        //         Numbers: result.numbers,
        //         Place: result.place.name,
        //         Draw_Type: result.drawtype.name,
        //         Username: result.user.username,
        //         User: result.user.firstName + ' ' + result.user.lastName,
        //         Bet_Amount: result.bet.amount
        //     });
        // });

        // res.status(200).json(resultsObj);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: error.message });
    }
};