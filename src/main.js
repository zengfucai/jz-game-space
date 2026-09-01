import "./style.css";

const app = document.querySelector("#app");

let games = [];
let currentCategory = "全部";
let searchKeyword = "";

// ================================
// 基础路径
// 自动兼容：
// 本地开发 /
// GitHub Pages /jz-game-space/
// ================================

const BASE_URL = import.meta.env.BASE_URL;


// ================================
// 初始化
// ================================

async function init() {
    try {
        const response = await fetch(
            `${BASE_URL}data/games.json`
        );

        if (!response.ok) {
            throw new Error(
                `无法读取游戏数据：${response.status}`
            );
        }

        games = await response.json();

        render();

    } catch (error) {

        console.error(error);

        app.innerHTML = `
            <div class="error-page">

                <h2>
                    游戏数据加载失败
                </h2>

                <p>
                    请检查 data/games.json 是否存在。
                </p>

                <p>
                    ${error.message}
                </p>

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
                .includes(
                    searchKeyword.toLowerCase()
                );

        return categoryMatch && keywordMatch;
    });


    app.innerHTML = `

        <!-- ========================= -->
        <!-- 导航栏 -->
        <!-- ========================= -->

        <header class="navbar">

            <div class="nav-container">

                <div class="logo">

                    <span class="logo-icon">
                        🎮
                    </span>

                    <span>
                        JZ 游戏空间
                    </span>

                </div>


                <nav>

                    <button
                        class="nav-item active"
                    >
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


        <!-- ========================= -->
        <!-- Hero -->
        <!-- ========================= -->

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

                    <span>
                        →
                    </span>

                </button>

            </div>


            <div
                class="hero-decoration decoration-1"
            ></div>


            <div
                class="hero-decoration decoration-2"
            ></div>

        </section>


        <!-- ========================= -->
        <!-- 数据统计 -->
        <!-- ========================= -->

        <section class="stats">

            <div class="stat-item">

                <strong>
                    ${games.length}
                </strong>

                <span>
                    游戏
                </span>

            </div>


            <div class="stat-item">

                <strong>
                    ${getCategories().length}
                </strong>

                <span>
                    分类
                </span>

            </div>


            <div class="stat-item">

                <strong>
                    ${getLatestGames().length}
                </strong>

                <span>
                    近期更新
                </span>

            </div>

        </section>


        <!-- ========================= -->
        <!-- 最新游戏 -->
        <!-- ========================= -->

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


        <!-- ========================= -->
        <!-- 游戏库 -->
        <!-- ========================= -->

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


            <!-- 搜索与分类 -->

            <div class="game-tools">


                <div class="search-box">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        id="searchInput"
                        placeholder="搜索游戏..."
                        value="${escapeHtml(
                            searchKeyword
                        )}"
                    >

                </div>


                <div class="categories">

                    ${renderCategories()}

                </div>

            </div>


            <!-- 游戏列表 -->

            <div class="game-grid">

                ${
                    filteredGames.length > 0
                        ? renderGameCards(
                            filteredGames
                        )
                        : renderEmpty()
                }

            </div>

        </section>


        <!-- ========================= -->
        <!-- 关于 -->
        <!-- ========================= -->

        <section
            class="about-section"
        >

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


        <!-- ========================= -->
        <!-- Footer -->
        <!-- ========================= -->

        <footer>

            <div>
                🎮 JZ 游戏空间
            </div>


            <div>
                持续更新中 ·
                ${new Date().getFullYear()}
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
                onclick="openGame('${escapeAttribute(
                    game.path
                )}')"
            >

                <div class="game-cover">

                    ${
                        game.cover
                            ? `
                                <img
                                    src="${escapeAttribute(
                                        game.cover
                                    )}"
                                    alt="${escapeAttribute(
                                        game.name
                                    )}"
                                >
                              `
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
                            ${escapeHtml(
                                game.name
                            )}
                        </h3>


                        <span class="game-category">

                            ${escapeHtml(
                                game.category
                            )}

                        </span>

                    </div>


                    <p>
                        ${escapeHtml(
                            game.description
                        )}
                    </p>


                    <div class="game-footer">

                        <span>
                            v${escapeHtml(
                                game.version
                            )}
                        </span>


                        <button
                            onclick="
                                event.stopPropagation();
                                openGame(
                                    '${escapeAttribute(
                                        game.path
                                    )}'
                                )
                            "
                        >
                            开始游戏

                            <span>
                                →
                            </span>

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
                data-category="${escapeAttribute(
                    category
                )}"
            >

                ${escapeHtml(category)}

            </button>

        `;

    }).join("");
}


function getCategories() {

    return [
        ...new Set(
            games
                .map(game => game.category)
                .filter(Boolean)
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
// 事件绑定
// ================================

function bindEvents() {

    const searchInput =
        document.querySelector(
            "#searchInput"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            event => {

                searchKeyword =
                    event.target.value;

                render();


                const input =
                    document.querySelector(
                        "#searchInput"
                    );


                if (input) {

                    input.focus();


                    input.setSelectionRange(
                        searchKeyword.length,
                        searchKeyword.length
                    );

                }

            }
        );

    }


    document
        .querySelectorAll(
            ".category-button"
        )
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
//
// games.json:
// "/games/snake/index.html"
//
// GitHub Pages:
// "/jz-game-space/games/snake/index.html"
//
// 本地:
// "/games/snake/index.html"
//

window.openGame = function(path) {

    if (!path) {
        console.error(
            "游戏路径为空"
        );
        return;
    }


    const cleanPath =
        path.replace(/^\/+/, "");


    const gameUrl =
        `${BASE_URL}${cleanPath}`;


    window.location.href =
        gameUrl;

};


// ================================
// 滚动到游戏库
// ================================

window.scrollToGames = function() {

    const element =
        document.querySelector(
            "#games"
        );


    if (element) {

        element.scrollIntoView({
            behavior: "smooth"
        });

    }

};


// ================================
// 滚动到最新游戏
// ================================

window.scrollToLatest = function() {

    const element =
        document.querySelector(
            "#latest"
        );


    if (element) {

        element.scrollIntoView({
            behavior: "smooth"
        });

    }

};


// ================================
// 关于
// ================================

window.showAbout = function() {

    const element =
        document.querySelector(
            ".about-section"
        );


    if (element) {

        element.scrollIntoView({
            behavior: "smooth"
        });

    }

};


// ================================
// HTML 安全处理
// ================================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

    return escapeHtml(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}


// ================================
// 启动
// ================================

init();
