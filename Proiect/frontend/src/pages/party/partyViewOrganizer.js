
let PartyViewOrganizer = {

    render: async (userDetails, partyDetails, statistics, nowPlaying) => {
        
        // const io=require("socket.io-client")
        // const ioClient=io.connect("http://localhost:8000");
        
        // ioClient.on("new",(message)=>{
        //     document.getElementById("nr_petrecareti").innerHTML=`${statistics.numberOfPlayers}`;
        //     console.log(message);
        // })
        return`
        <div class="wrapper">
            <div class="page-button">
            ${
                partyDetails.status === 'live' ?
                    `<button class="action-button close-button" id="stop">Opreste petrecerea</button>`
                :
                partyDetails.status === 'open' ?
                    `<button class="action-button start-button" id="start">Porneste petrecerea</button>`
                :
                ''
            }   
            </div>
            <div class="page-button">
            ${
                partyDetails.status === 'live' ?
                    `<button class="action-button start-button" id="playFirstSong">Reda prima  melodie</button>`
                :
                ''
            }   
            </div>
            <div class="page-flex">
                <div class="card">
                    <div class="card-title">
                        ${partyDetails.name}
                    </div>
                    <div class="card-infos">
                        <div class="card-info">Status:</div>
                        <div class="card-details">${partyDetails.status}</div>
                    </div>
                    <div class="card-infos">
                        <div class="card-info">Codul petrecerii:</div>
                        <div class="card-details">${partyDetails.partyCode}</div>
                    </div>
                    <div class="card-infos">
                        <div class="card-info">Durata petrecerii:</div>
                        <div class="card-details">${partyDetails.duration} minute</div>
                    </div>
                </div>
                ${
                    (partyDetails.status === 'live' || partyDetails.status === 'closed') &&
                    `
                        <div class="card">
                            <div class="card-title">Statistici</div>
                            <div class="card-infos">
                                <div class="card-info">Numarul de petrecareti:</div>
                                <div class="card-details" id="nr_petrecareti">${statistics.numberOfPlayers}</div>
                            </div>
                        </div>
                    `
                }
                ${
                    partyDetails.status === 'live' &&
                    `
                        <div class="card">
                            <div class="card-title">Melodia redata acum</div>
                            <div class="card-info">${nowPlaying.nowPlaying === 'none' ? 'Inca nu este redata nicio melodie': nowPlaying.nowPlaying}</div>
                        </div>
                    `
                }
            </div>
               

        </div>
        `
    },
    after_render: async (startParty, getParty,getFirstSong) => {
        
        if(document.getElementById('start')) {
            document.getElementById('start').addEventListener('click', async ()=> {
                await startParty()
                // await getParty()
                window.location.reload(true)
            })
        }
        document.getElementById('playFirstSong').addEventListener('click', async() => {
            console.log('aici da')
            await getFirstSong()
        })

    } 
}
export default PartyViewOrganizer