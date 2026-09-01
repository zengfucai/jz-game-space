import "./style.css";

const app = document.querySelector("#app");

let games = [];
let currentCategory = "全部";
let searchKeyword = "";

// ================================
// 初始化
// ================================

async function init() {
    try {
        const response = await fetch("/data/games.json");

        if (!response.ok) {
            throw new Error("无法读取游戏数据");
        }

        games = await response.json();

        render();
    } catch (error) {
        console.error(error);

        app.innerHTML = `
            <div class="error-page">
                <h2>游戏数据加载失败</h2>
                <p>请检查 games.json 是否存在。</p>
            </div>
        `;
    }
}


// ================================
// 页面渲染
// ================================

function render() {

    const filteredGames = games.filter(game => {

        const categoryMatch =
            currentCategory === "全部" ||
            game.category === currentCategory;

        const keywordMatch =
            game.name
                .toLowerCase()
                .includes(searchKeyword.toLowerCase());

        return categoryMatch && keywordMatch;
    });

    app.innerHTML = `

        <!-- 导航栏 -->
        <header class="navbar">

            <div class="nav-container">

                <div class="logo">
                    <span class="logo-icon">🎮</span>
                    <span>JZ 游戏空间</span>
                </div>

                <nav>
                    <button class="nav-item active">
                        首页
                    </button>

                    <button
                        class="nav-item"
                        onclick="scrollToGames()"
                    >
                        游戏库
                    </button>

                    <button
                        class="nav-item"
                        onclick="scrollToLatest()"
                    >
                        最新游戏
                    </button>

                    <button
                        class="nav-item"
                        onclick="showAbout()"
                    >
                        关于
                    </button>
                </nav>

            </div>

        </header>


        <!-- Hero -->
        <section class="hero">

            <div class="hero-content">

                <div class="hero-tag">
                    🎮 WEB GAME COLLECTION
                </div>

                <h1>
                    JZ 游戏空间
                </h1>

                <p>
                    收藏、创作、分享一些有趣的网页小游戏
                </p>

                <button
                    class="hero-button"
                    onclick="scrollToGames()"
                >
                    开始探索
                    <span>→</span>
                </button>

            </div>

            <div class="hero-decoration decoration-1"></div>
            <div class="hero-decoration decoration-2"></div>

        </section>


        <!-- 数据统计 -->
        <section class="stats">

            <div class="stat-item">
                <strong>${games.length}</strong>
                <span>游戏</span>
            </div>

            <div class="stat-item">
                <strong>${getCategories().length}</strong>
                <span>分类</span>
            </div>

            <div class="stat-item">
                <strong>${getLatestGames().length}</strong>
                <span>近期更新</span>
            </div>

        </section>


        <!-- 最新游戏 -->
        <section
            class="section latest-section"
            id="latest"
        >

            <div class="section-header">

                <div>
                    <span class="section-label">
                        NEW
                    </span>

                    <h2>
                        最新游戏
                    </h2>
                </div>

                <button
                    class="text-button"
                    onclick="scrollToGames()"
                >
                    查看全部 →
                </button>

            </div>


            <div class="game-grid">

                ${renderGameCards(
                    getLatestGames()
                )}

            </div>

        </section>


        <!-- 游戏库 -->
        <section
            class="section games-section"
            id="games"
        >

            <div class="section-header">

                <div>
                    <span class="section-label">
                        COLLECTION
                    </span>

                    <h2>
                        游戏库
                    </h2>
                </div>

            </div>


            <!-- 搜索 -->
            <div class="game-tools">

                <div class="search-box">

                    <span>🔍</span>

                    <input
                        type="text"
                        id="searchInput"
                        placeholder="搜索游戏..."
                        value="${searchKeyword}"
                    >

                </div>


                <!-- 分类 -->
                <div class="categories">

                    ${renderCategories()}

                </div>

            </div>


            <div class="game-grid">

                ${
                    filteredGames.length > 0
                        ? renderGameCards(filteredGames)
                        : renderEmpty()
                }

            </div>

        </section>


        <!-- 关于 -->
        <section class="about-section">

            <div class="about-content">

                <span class="section-label">
                    ABOUT
                </span>

                <h2>
                    关于 JZ 游戏空间
                </h2>

                <p>
                    这是一个属于我的网页小游戏空间。
                    这里会持续收录我制作和整理的各种小游戏。
                    随着时间推移，这里的游戏会越来越多。
                </p>

            </div>

        </section>


        <!-- Footer -->
        <footer>

            <div>
                🎮 JZ 游戏空间
            </div>

            <div>
                持续更新中 · ${new Date().getFullYear()}
            </div>

        </footer>

    `;

    bindEvents();
}


// ================================
// 游戏卡片
// ================================

function renderGameCards(gameList) {

    return gameList.map(game => {

        return `

            <article
                class="game-card"
                onclick="openGame('${game.path}')"
            >

                <div class="game-cover">

                    ${
                        game.cover
                            ? `<img
                                src="${game.cover}"
                                alt="${game.name}"
                              >`
                            : `
                                <div class="cover-placeholder">
                                    ${game.icon || "🎮"}
                                </div>
                              `
                    }

                    ${
                        game.isNew
                            ? `
                                <span class="new-badge">
                                    NEW
                                </span>
                              `
                            : ""
                    }

                </div>


                <div class="game-info">

                    <div class="game-title-row">

                        <h3>
                            ${game.name}
                        </h3>

                        <span class="game-category">
                            ${game.category}
                        </span>

                    </div>


                    <p>
                        ${game.description}
                    </p>


                    <div class="game-footer">

                        <span>
                            v${game.version}
                        </span>

                        <button
                            onclick="event.stopPropagation(); openGame('${game.path}')"
                        >
                            开始游戏
                            <span>→</span>
                        </button>

                    </div>

                </div>

            </article>

        `;

    }).join("");
}


// ================================
// 分类
// ================================

function renderCategories() {

    const categories = [
        "全部",
        ...getCategories()
    ];

    return categories.map(category => {

        return `

            <button
                class="category-button ${
                    currentCategory === category
                        ? "active"
                        : ""
                }"
                data-category="${category}"
            >
                ${category}
            </button>

        `;

    }).join("");
}


function getCategories() {

    return [
        ...new Set(
            games.map(game => game.category)
        )
    ];

}


// ================================
// 最新游戏
// ================================

function getLatestGames() {

    return [...games]
        .sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        )
        .slice(0, 3);

}


// ================================
// 空状态
// ================================

function renderEmpty() {

    return `

        <div class="empty-state">

            <div>
                🔍
            </div>

            <h3>
                没有找到游戏
            </h3>

            <p>
                换一个关键词试试吧
            </p>

        </div>

    `;
}


// ================================
// 事件
// ================================

function bindEvents() {

    const searchInput =
        document.querySelector("#searchInput");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            event => {

                searchKeyword =
                    event.target.value;

                render();

                // 重新聚焦输入框
                const input =
                    document.querySelector(
                        "#searchInput"
                    );

                input.focus();

                input.setSelectionRange(
                    searchKeyword.length,
                    searchKeyword.length
                );

            }
        );

    }


    document
        .querySelectorAll(".category-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    currentCategory =
                        button.dataset.category;

                    render();

                }
            );

        });

}


// ================================
// 打开游戏
// ================================

window.openGame = function(path) {

    window.location.href = path;

};


// ================================
// 滚动
// ================================

window.scrollToGames = function() {

    document
        .querySelector("#games")
        .scrollIntoView({
            behavior: "smooth"
        });

};


window.scrollToLatest = function() {

    document
        .querySelector("#latest")
        .scrollIntoView({
            behavior: "smooth"
        });

};


// ================================
// 关于
// ================================

window.showAbout = function() {

    document
        .querySelector(".about-section")
        .scrollIntoView({
            behavior: "smooth"
        });

};


// 启动
init();