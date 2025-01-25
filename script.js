document.addEventListener("DOMContentLoaded", function () {
    const formSelect = document.getElementById("form");
    const tabletOptions = document.getElementById("tabletOptions");
    const shapeField = document.getElementById("shape").closest(".mb-3");
    const shapeSelect = document.getElementById("shape");
    const form = document.getElementById("medicineForm");
    const colorSelect = document.getElementById("color");
    const customColorDiv = document.getElementById("customColorDiv");
    const customColorInput = document.getElementById("customColor");

    // Obsługa zmiany pola "Postać leku"
    formSelect.addEventListener("change", function () {
        const selectedValue = formSelect.value;

        if (selectedValue === "tablet" || selectedValue === "capsule") {
            tabletOptions.classList.remove("d-none");
        } else {
            tabletOptions.classList.add("d-none");
        }

        if (selectedValue === "tablet") {
            shapeField.classList.remove("d-none");
            shapeSelect.setAttribute("required", "required");
        } else {
            shapeField.classList.add("d-none");
            shapeSelect.removeAttribute("required");
        }
    });

    // Obsługa zmiany w polu "Kolor"
    colorSelect.addEventListener("change", function () {
        if (colorSelect.value === "custom") {
            customColorDiv.classList.remove("d-none");
        } else {
            customColorDiv.classList.add("d-none");
        }
    });

    // Obsługa wysyłania formularza
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = {
            form: formSelect.value,
            color: colorSelect.value === "custom" ? customColorInput.value : colorSelect.value,
            time: document.getElementById("time").value,
            shape: formSelect.value === "tablet" ? shapeSelect.value : null,
            hasEmphasis: document.getElementById("hasEmphasis").checked,
            comments: document.getElementById("comments").value
        };

        console.log("Dane z formularza:", formData);

        try {
            const response = await fetch("http://localhost:2137/send-to-sheets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Formularz został pomyślnie zapisany w Google Sheets!");
            } else {
                throw new Error("Wystąpił problem podczas zapisu danych.");
            }
        } catch (error) {
            console.error("Błąd:", error);
            alert("Wystąpił problem podczas zapisu danych. Sprawdź konsolę.");
        }

        form.reset();

        tabletOptions.classList.add("d-none");
        customColorDiv.classList.add("d-none");
        shapeField.classList.add("d-none");
        shapeSelect.removeAttribute("required");
    });
});
