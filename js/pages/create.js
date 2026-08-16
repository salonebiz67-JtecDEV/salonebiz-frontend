export async function renderCreate(app) {

    app.innerHTML = `

        <div class="page">

            <header class="app-header">

                <div class="header-inner">

                    <div class="brand">
                        Create Post
                    </div>

                </div>

            </header>


            <main class="container">

                <h1 class="page-title">
                    Share your business
                </h1>

                <p class="page-subtitle">
                    Upload a photo and tell people about your business.
                </p>


                <section class="create-box">

                    <label
                        class="upload-area"
                        for="imageInput"
                        id="uploadArea"
                    >

                        <div id="uploadText">

                            <div style="font-size:40px">
                                📸
                            </div>

                            <p>
                                Tap to choose an image
                            </p>

                            <small>
                                JPG, PNG or WEBP
                            </small>

                        </div>

                    </label>


                    <input
                        id="imageInput"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        hidden
                    >


                    <input
                        class="form-input"
                        id="businessName"
                        placeholder="Business name"
                    >


                    <input
                        class="form-input"
                        id="location"
                        placeholder="Location"
                    >


                    <textarea
                        class="form-input"
                        id="description"
                        rows="4"
                        placeholder="Tell people about your business..."
                    ></textarea>


                    <button
                        class="primary-button"
                        id="publishButton"
                    >
                        Publish Post
                    </button>

                </section>

            </main>

        </div>
    `;


    const input =
        document.getElementById(
            "imageInput"
        );

    const area =
        document.getElementById(
            "uploadArea"
        );


    input.addEventListener(
        "change",
        () => {

            const file =
                input.files[0];

            if (!file) return;


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Please choose an image."
                );

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                event => {

                    area.innerHTML = `

                        <img
                            src="${event.target.result}"
                            alt="Selected image"
                        >

                    `;

                };


            reader.readAsDataURL(file);

        }
    );


    document
        .getElementById("publishButton")
        .addEventListener(
            "click",
            () => {

                const file =
                    input.files[0];

                const business =
                    document.getElementById(
                        "businessName"
                    ).value.trim();

                const description =
                    document.getElementById(
                        "description"
                    ).value.trim();

                const location =
                    document.getElementById(
                        "location"
                    ).value.trim();


                if (!file) {

                    alert(
                        "Please select an image."
                    );

                    return;
                }


                if (!business) {

                    alert(
                        "Enter your business name."
                    );

                    return;
                }


                console.log({
                    file,
                    business,
                    description,
                    location
                });


                alert(
                    "Post ready. Backend image upload comes next."
                );

            }
        );
}
