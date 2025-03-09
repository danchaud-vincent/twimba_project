import {tweetsData} from './data.js'
import { v4 as uuidv4 } from 'https://cdn.jsdelivr.net/npm/uuid@latest/+esm';

// element html
const feed = document.getElementById("feed")

// get the data into the local storage


// render the html
render()


document.addEventListener('click', function(e){

    if (e.target.dataset.likes){
        handleLikeClick(e.target.dataset.likes)
        render()
    }
    else if (e.target.dataset.retweets){
        handleRetweetClick(e.target.dataset.retweets)
        render()
    }
    else if (e.target.dataset.replies){
        handleReplyClick(e.target.dataset.replies)
    }

})

// ---------- FUNCTIONS ----------
function handleReplyClick(id){
    document.getElementById(`replies-${id}`).classList.toggle('hidden')
}

function handleLikeClick(id){

    const tweetSelected = tweetsData.filter(tweet => tweet.uuid === id)[0]

    // increment the number of liked
    if (tweetSelected.isLiked){
        tweetSelected.likes--
    }
    else{
        tweetSelected.likes++
    }
    
    // set isLiked
    tweetSelected.isLiked = !tweetSelected.isLiked
}

function handleRetweetClick(id){
    
    const tweetSelected = tweetsData.filter(tweet => tweet.uuid === id)[0]
    
    // increment the number of retweets
    if (tweetSelected.isRetweeted){
        tweetSelected.retweets--
    }
    else{
        tweetSelected.retweets++
    }
    
    // set isLiked
    tweetSelected.isRetweeted = !tweetSelected.isRetweeted
}



function render(){
    let tweetDOM = ''

    tweetsData.forEach(function(tweet){

        // check if liked & retweeted
        let isLiked = ''
        let isRetweeted = ''
        
        if (tweet.isLiked){
            isLiked = 'liked'
        }

        if (tweet.isRetweeted){
            isRetweeted = 'retweetted'
        }

        // get the replies
        let repliesDOM = ''

        tweet.replies.forEach(function(reply){

            repliesDOM += `
                            <div class="tweet">
                                <img src="${reply.profilePic}" class="profile-picture">
                                <div class="tweet-inner">
                                    <h2>${reply.handle}</h2>
                                    <p>${reply.tweetText}</p>
                                </div>
                            </div>
                            `
        })


        // create the inner html for a tweet
        tweetDOM += `
                    <div class="tweet">
                        <img src="${tweet.profilePic}" class="profile-picture">
                        <div class="tweet-inner">
                            <h2>${tweet.handle}</h2>
                            <p>${tweet.tweetText}</p>

                            <div class="tweet-details">
                                <span class="tweet-detail-number">
                                    <i class="fa-regular fa-comment-dots" data-replies='${tweet.uuid}'></i>
                                    ${tweet.replies.length}
                                </span>
                                <span>
                                    <i class="fa-solid fa-heart ${isLiked}" data-likes='${tweet.uuid}'></i>
                                    ${tweet.likes}
                                </span>
                                <span>
                                    <i class="fa-solid fa-retweet ${isRetweeted}" data-retweets='${tweet.uuid}'></i>
                                    ${tweet.retweets}
                                </span>
                            </div>
                            <div class="hidden" id="replies-${tweet.uuid}">
                                <div class="replies-comment-area">
                                    <textarea placeholder="Comment" id="comment-input-${tweet.uuid}"></textarea>
                                    <button class="comment-btn" id="comment-btn-${tweet.uuid}">comment</button>
                                </div>
                                ${repliesDOM}
                            </div>
                        </div>
                    </div>
                    `
    
        // add 
    })

    feed.innerHTML = tweetDOM

}
