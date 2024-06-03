const drawModel = require('../models/drawModel');
const betModel = require('../models/betsModel');
const settingsModel = require('../models/settingsModel');
const userModel = require('../models/userModel');

exports.getResults = async (req, res) => {
    try {
        const byDate = req.params.byDate;

        const draws = await drawModel.draw.find({ date: byDate }, '_id date typeId placeId numbers');
        const bets = await betModel.bet.find({ drawDate: byDate }, '_id userId date drawTypeId betData');

        const results = [];

        for (let i = 0; i < draws.length; i++) {
            for(let j = 0; j < bets.length; j++) {
                if (draws[i].typeId === bets[j].drawTypeId) {
                    for (let k = 0; k < bets[j].betData.length; k++) {
                        if (draws[i].numbers === bets[j].betData[k].numbers) {
                            const [drawType] = await settingsModel.drawType.find({ id: draws[i].typeId }, 'name');
                            const [place] = await settingsModel.place.find({ id: draws[i].placeId }, 'name');
                            const [user] = await userModel.user.find({ id: bets[j].userId }, '_id username firstName lastName');

                            results.push({
                                Bet_ID: bets[j]._id,
                                Draw_ID: draws[i]._id,
                                Betted_Date: bets[j].date,
                                Draw_Date: draws[i].date,
                                Draw_Type: drawType.name,
                                Place: place.name,
                                User_ID: user._id,
                                User_Name: `${user.firstName} ${user.lastName}`,
                                Numbers: draws[i].numbers,
                                Amount: bets[j].betData[k].amount
                            });
                        }
                    }
                }
            }
        }

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ title: 'Error!', message: error.message });
    }
};
