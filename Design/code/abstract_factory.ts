interface Button {
  renderButton(): void;
}

interface Checkbox {
  renderCheckbox(): void;
}

class WindowsButton implements Button {
  renderButton() {
    console.log("Rendering a Windows button");
  }
}

class MacButton implements Button {
  renderButton() {
    console.log("Rendering a Mac button");
  }
}

class WindowsCheckbox implements Checkbox {
  renderCheckbox() {
    console.log("Rendering a Windows Checkbox");
  }
}

class MacCheckbox implements Checkbox {
  renderCheckbox() {
    console.log("Rendering a Mac Checkbox");
  }
}

interface UIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

class WindowsUIFactory implements UIFactory {
  createButton(): Button {
    return new WindowsButton();
  }
  createCheckbox(): Checkbox {
    return new WindowsCheckbox();
  }
}

class MacUIFactory implements UIFactory {
  createButton(): Button {
    return new MacButton();
  }
  createCheckbox(): Checkbox {
    return new MacCheckbox();
  }
}

class Application {
  private factory: UIFactory;

  constructor(factory: UIFactory) {
    this.factory = factory;
  }

  createUI(): void {
    const button = this.factory.createButton();
    const checkbox = this.factory.createCheckbox();

    button.renderButton();
    checkbox.renderCheckbox();
  }
}

const winFactory = new WindowsUIFactory();
const macFactory = new MacUIFactory();

console.log("Creating UI for Windows:");
const windowsApp = new Application(winFactory);
windowsApp.createUI();

console.log("\nCreating UI for macOS:");
const macApp = new Application(macFactory);
macApp.createUI();

// Creating UI for Windows:
// Rendering a Windows button
// Rendering a Windows Checkbox

// Creating UI for macOS:
// Rendering a Mac button
// Rendering a Mac Checkbox
