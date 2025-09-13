document.addEventListener("DOMContentLoaded", function () {

    let currentUsername = "IGN/Username"; // default fallback name

    const createUserBtn = document.getElementById("createUser");
    const usernameForm = document.getElementById("username-form");
    const usernameInput = document.getElementById("username-input");
    const saveUsernameBtn = document.getElementById("save-username");
    const cancelUsernameBtn = document.getElementById("cancel-username");

    if (createUserBtn && usernameForm) {
        createUserBtn.addEventListener("click", function () {
            usernameForm.classList.remove("hidden");
        });

        cancelUsernameBtn.addEventListener("click", function () {
            usernameForm.classList.add("hidden");
            usernameInput.value = "";
        });

        saveUsernameBtn.addEventListener("click", function () {
            const newName = usernameInput.value.trim();
            if (newName) {
                currentUsername = newName;
                alert(`Username set to: ${currentUsername}`);
                usernameForm.classList.add("hidden");
                usernameInput.value = "";
            } else {
                alert("Please enter a username.");
            }
        });
    }


    // === FORM LOGIC ===
    const form = document.getElementById("change");
    const formContent = document.getElementById("form-content");
    const originalFormHTML = formContent ? formContent.innerHTML : "";

    function reattachEvents() {
        const agree = document.getElementById("agree");
        const button = document.getElementById("submitForm");

        if (agree && button) {
            agree.addEventListener("change", function () {
                button.disabled = !agree.checked;
            });
        }

        if (form) {
            form.addEventListener("submit", handleSubmit);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        const IGN = document.getElementById("IGN").value;
        const UID = document.getElementById("UID").value;

        localStorage.setItem("userIGN", IGN);

        formContent.innerHTML = `
        <h2>Hello Welcome to BDC</h2>
        <h4 style="text-align: left;">About us:</h4>
        <p style="text-align: justify;">
        Connection to Bisadak Community is a group of Bisaya CODM players 
        united by their love for the game, 
        where members can communicate, play together, 
        and build lasting friendships.</p>
        <button onclick="rules()" class="btn" style="font-size: 2rem;">&#10095</button>
    `;
    }

    window.rules = function () {
        formContent.innerHTML = `
        <h2 style="text-align: left;">Rules:</h2>
        <p>Do's:<br>
            - Respect the admins and members of the community<br>
            - Active in community engagements<br>
            - Be friendly</p>
        <button onclick="dontFunc()" class="btn" style="font-size: 2rem;">&#10095</button>
    `;
    };

    window.dontFunc = function () {
        formContent.innerHTML = `
        <h2 style="text-align: left;">Rules:</h2>
        <p>Don't:<br>
            - NO TRASHTALKING TO ALL PLAYERS<br>
            - No spamming of unnecessary photos, videos, emojis, and mentions<br>
            - No to racists, homophobics, body shamers, and toxic players<br>
            - No to sending explicit and inappropriate photos and videos<br>
            - No to immodest igns (ex. bilat, oten, dick, pussy)<br>
            - No to dummy accounts<br>
            - No community tag</p>
        <button onclick="cancelForm()" class="btn">Cancel</button>
        <button onclick="letsgo()" class="btn">Let's Go!</button>
    `;
    };

    window.cancelForm = function () {
        formContent.innerHTML = originalFormHTML;
        reattachEvents();
    };

    window.letsgo = function () {
        setTimeout(() => {
            window.location.href = "Feed.html";
        }, 500);
    };

    if (form) {
        form.addEventListener("reset", function () {
            setTimeout(() => {
                formContent.innerHTML = originalFormHTML;
                reattachEvents();
            }, 0);
        });
    }

    const logoutBtn = document.getElementById("log-out");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            window.location.href = "Form.html";
        });
    }

    reattachEvents();

    // === POST BUTTON (NEW) ===
    const postButton = document.getElementById("post-button");
    const postText = document.getElementById("post-text");
    const postImage = document.getElementById("post-image");
    const feedContainer = document.getElementById("feed-container");

    if (postButton) {
        postButton.addEventListener("click", function () {
            const text = postText.value.trim();
            const imageFile = postImage.files[0];

            if (!text && !imageFile) {
                alert("Please add a caption or image.");
                return;
            }

            const reader = new FileReader();

            reader.onload = function (e) {
                const postCard = document.createElement("div");
                postCard.className = "post-card";
                postCard.innerHTML = `
                    <div class="post-header">
                        <span class="username">${localStorage.getItem("userIGN") || "Unknown Player"}</span>
                    </div>
                    <div class="post-body">
                        <p class="description">${text}</p>
                        ${imageFile ? `<img src="${e.target.result}" alt="Post Image" class="post-img">` : ""}
                    </div>
                    <div class="post-reactions">
                        <span class="emoji">👍</span>
                        <span class="emoji">❤️</span>
                        <span class="emoji">🔥</span>
                        <span class="emoji">😮</span>
                    </div>
                    <div class="user-reaction"></div>
                    <div class="post-comment">
                        <div class="comment-input-wrapper">
                            <input type="text" placeholder="Write a comment..." class="comment-box">
                            <button class="send-comment-btn"><i class="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                `;

                feedContainer.style.display = "block";

                feedContainer.prepend(postCard);
                postText.value = "";
                postImage.value = "";

                reattachPostEvents(postCard);
            };

            if (imageFile) {
                reader.readAsDataURL(imageFile);
            } else {
                reader.onload({ target: { result: "" } }); // Simulate empty image
            }
        });
    }

    function reattachPostEvents(postCard) {
        const reactionEmojis = postCard.querySelectorAll('.post-reactions .emoji');
        const userReactionDisplay = postCard.querySelector('.user-reaction');
        reactionEmojis.forEach(emoji => {
            emoji.addEventListener('click', () => {
                const selectedEmoji = emoji.textContent;
                userReactionDisplay.textContent = `You reacted with ${selectedEmoji}`;
                reactionEmojis.forEach(e => e.classList.remove('selected'));
                emoji.classList.add('selected');
            });
        });

        const commentBtn = postCard.querySelector(".send-comment-btn");
        const commentInput = postCard.querySelector(".comment-box");
        const commentSection = postCard.querySelector(".post-comment");

        commentBtn.addEventListener("click", function () {
            const comment = commentInput.value.trim();
            if (comment) {
                const commentElement = document.createElement("p");
                commentElement.innerHTML = `<strong>You:</strong> ${comment}`;
                commentSection.appendChild(commentElement);
                commentInput.value = "";
            }
        });
    }

    // === STATIC REACTION HANDLERS FOR EXISTING POSTS ===
    document.querySelectorAll('.post-card').forEach(card => {
        const reactionEmojis = card.querySelectorAll('.post-reactions .emoji');
        const userReactionDisplay = card.querySelector('.user-reaction');

        reactionEmojis.forEach(emoji => {
            emoji.addEventListener('click', () => {
                const selectedEmoji = emoji.textContent;
                userReactionDisplay.textContent = `You reacted with ${selectedEmoji}`;
                reactionEmojis.forEach(e => e.classList.remove('selected'));
                emoji.classList.add('selected');
            });
        });
    });

    // === STATIC COMMENT HANDLERS FOR EXISTING POSTS ===
    const commentButtons = document.querySelectorAll(".send-comment-btn");
    commentButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            const input = this.previousElementSibling;
            const comment = input.value.trim();
            if (comment) {
                const commentElement = document.createElement("p");
                commentElement.innerHTML = `<strong>You:</strong> ${comment}`;
                this.closest(".post-card").querySelector(".post-comment").appendChild(commentElement);
                input.value = "";
            }
        });
    });

    // === CHAT FEATURE ===
    const chatSendBtn = document.getElementById("send-btn");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.querySelector(".chat-messages");

    if (chatSendBtn && chatInput && chatMessages) {
        chatSendBtn.addEventListener("click", function () {
            const message = chatInput.value.trim();
            if (message !== "") {
                const newMessage = document.createElement("p");
                newMessage.innerHTML = `<strong>You:</strong> ${message}`;
                chatMessages.appendChild(newMessage);
                chatInput.value = "";
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
    }

    // === CHAT TOGGLE ===
    const openChatBtn = document.getElementById("open-chat");
    const chatRoom = document.getElementById("chat-room");
    const closeChatBtn = document.getElementById("close-chat");

    if (openChatBtn && chatRoom && closeChatBtn) {
        openChatBtn.addEventListener("click", () => {
            chatRoom.classList.remove("hidden");
        });

        closeChatBtn.addEventListener("click", () => {
            chatRoom.classList.add("hidden");
        });
    }
});
