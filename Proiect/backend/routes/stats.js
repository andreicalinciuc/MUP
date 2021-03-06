const router = require('express').Router()
var moment = require('moment')
const verify = require('../global-functions/verifyToken')
const { addPartyValidation } = require('../validation')
const Party = require('../model/partyModel')
const OpenParties = require('../model/openPartyModel')
const User = require('../model/userModel')
let { initSpotify, getRecommandations } = require('../global-functions/spotify')
let spotifyApi = initSpotify()


router.get('/getParties/:id', verify, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        if (user.role === 'partyOrganizer') {
            const parties = await Party.find({ creatorId:user.id})
            
            const statstics=[]
            parties.forEach(async (party,index)=>{
                const part=await OpenParties.find({ partyId: party.id})
                
                statstics.push({
                    name: party.name,
                    nrPeople: part.length
                });
            });
            res.send({
                parties: statstics
            });
        } 
    } catch (err) {
        res.status(400).send({
            error: {
                message: err,
                status: 400
            }
        })
    }
})


router.get('/getPartiesGenres', verify, async (req, res) => {
    try {
        let liveParty =await OpenParties.find({})
        let genres = []
        liveParty.map((user, index) => {
            // genres.push()
            
            if (genres.hasOwnProperty(`${user.favGenre.toLowerCase()}`)) {
                genres[`${user.favGenre.toLowerCase()}`] = genres[`${user.favGenre.toLowerCase()}`] + 1
            }
            else {
                genres[`${user.favGenre.toLowerCase()}`] = 1
            }
        })

        var sortable = [];
        for (var gen in genres) {
            sortable.push([gen, genres[gen]]);
        }

        sortable.sort(function(a, b) {
            return a[1] - b[1];
        });
        if(sortable.length==0)
            res.send({
                fav1:" ",
                fav2:" ",
                fav3:" "
            });
        else if(sortable.length==1)
            res.send({
                fav1:sortable[0][0],
                fav2:" ",
                fav3:" "
            });
        else if(sortable.length==2)
            res.send({
                fav1:sortable[0][0],
                fav2:sortable[1][0],
                fav3:" "
            });
        else
            res.send({
                fav1:sortable[0][0],
                fav2:sortable[1][0],
                fav3:sortable[2][0]
            });

    } catch (err) {
        res.status(400).send({
            error: {
                message: err,
                status: 400
            }
        })
    }
})



module.exports=router