import {tweetsData} from './data.js'
import { v4 as uuidv4 } from 'https://cdn.jsdelivr.net/npm/uuid@latest/+esm';

// element html
const feed = document.getElementById("feed")
const tweetBtn = document.getElementById('tweet-btn')

// get the data into the local storage
if(!localStorage.getItem('data-tweet')){
    localStorage.setItem('data-tweet', JSON.stringify(tweetsData))
}

// render the html
render()


// ---------- EVENTS ----------
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
    else if (e.target.dataset.comment){
        handleCommentClick(e.target.dataset.comment)
        render()
    }
    else if (e.target.dataset.delete){
        handleDeleteClick(e.target.dataset)
        render()
    }

})

tweetBtn.addEventListener('click', function(){

    // get the tweet input
    const tweetInput = document.getElementById('tweet-input')

    // create new tweet Object
    if (tweetInput.value){
        const newTweet = {
            handle: `@ScrimbaUser`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
        }

        // get the data from localstorage
        let data = getDataFromLocalStorage()

        // add to data
        data.unshift(newTweet)

        // set data
        localStorage.setItem('data-tweet', JSON.stringify(data))

        // clear the value
        tweetInput.value = ''

        render()
    }
})



// ---------- FUNCTIONS ----------
function getDataFromLocalStorage(){
    // get the data
    const data_string = localStorage.getItem('data-tweet')
    const data = JSON.parse(data_string)

    return data
}

function handleReplyClick(id){
    document.getElementById(`replies-${id}`).classList.toggle('hidden')
}

function handleLikeClick(id){

    // get the data
    const data = getDataFromLocalStorage()

    const tweetSelected = data.filter(tweet => tweet.uuid === id)[0]

    // increment the number of liked
    if (tweetSelected.isLiked){
        tweetSelected.likes--
    }
    else{
        tweetSelected.likes++
    }
    
    // set isLiked
    tweetSelected.isLiked = !tweetSelected.isLiked

    // set the data to localstorage
    localStorage.setItem('data-tweet', JSON.stringify(data))
}

function handleRetweetClick(id){

    // get the data
    const data = getDataFromLocalStorage()
    
    const tweetSelected = data.filter(tweet => tweet.uuid === id)[0]
    
    // increment the number of retweets
    if (tweetSelected.isRetweeted){
        tweetSelected.retweets--
    }
    else{
        tweetSelected.retweets++
    }
    
    // set isLiked
    tweetSelected.isRetweeted = !tweetSelected.isRetweeted

    // set the data to localstorage
    localStorage.setItem('data-tweet', JSON.stringify(data))
}

function handleCommentClick(id){

    // get the textarea of the comment section
    const commentInput = document.getElementById(`comment-input-${id}`)

    if (commentInput.value){

        // create a reply object
        const reply = {
            handle: `@ScrimbaUser`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: commentInput.value,
        }

        // get the data
        const data = getDataFromLocalStorage()
        const tweetCommented = data.filter(tweet => tweet.uuid === id)[0]

        // add the reply to the data
        tweetCommented.replies.unshift(reply)

        // set the data to local storage
        localStorage.setItem('data-tweet', JSON.stringify(data))
    }
}

function handleDeleteClick(dataset){
    // get the id
    const id = dataset.delete

    // check if the tweet is a comment
    const isComment = dataset.iscomment

    // get the data
    const data = getDataFromLocalStorage()

    if (isComment){
        // filter the tweet selected
        const tweetSelected = data.filter(tweet => tweet.uuid ===id)[0]

        // get index of the reply
        const indexReply = Number(isComment)

        tweetSelected.replies = tweetSelected.replies.filter((tweet, index) => index !== indexReply)
    
        // set the data to local storage
        localStorage.setItem('data-tweet', JSON.stringify(data))
    }
    else{
        // filter the tweet
        const dataFiltered = data.filter(tweet => tweet.uuid !== id)

        // set the data to local storage
        localStorage.setItem('data-tweet', JSON.stringify(dataFiltered))
    }
}


function render(){
    // get the data
    const data = getDataFromLocalStorage()

    // init tweet dom
    let tweetDOM = ''

    data.forEach(function(tweet){

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

        tweet.replies.forEach(function(reply, index){

            repliesDOM += `
                            <div class="tweet">
                                <img src="${reply.profilePic}" class="profile-picture">
                                <i class="fa-solid fa-trash delete-tweet" data-delete='${tweet.uuid}' data-iscomment='${index}'></i>
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
                        <i class="fa-solid fa-trash delete-tweet" data-delete='${tweet.uuid}'></i>

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
                                    <button class="comment-btn" data-comment="${tweet.uuid}">comment</button>
                                </div>
                                ${repliesDOM}
                            </div>
                        </div>
                    </div>
                    `
    })

    feed.innerHTML = tweetDOM

}
