# Dutch Income Tax Calculator as of 2025

> **Disclaimer**: This application was created as a practice project to improve my JavaScript, HTML, and CSS skills. The tax brackets and rates used in this calculator are fictional and should not be used for actual tax calculations. They serve only as sample data to demonstrate the calculation logic and user interface design.

A simple and efficient tax calculator built with vanilla JavaScript, HTML, and CSS.

## Features

- Real-time tax calculation
- Tax brackets
- Euro currency formatting
- Mobile-responsive design
- Local storage for persistence
- Tax credit brackets (General and Labour)
- English labels with Dutch names in parentheses to match the UI

## Income Tax Brackets (Inkomstenbelasting) as of 2025

- 35.82% : €0 - 38,441
- 37.48% : €38,442 - 76,817
- 49.50% : €76,818 - inf

## Tax Credit Brackets as of 2025

Values shown are for individuals under AOW age.

### General Tax Credit (Algemene heffingskorting)

- Income ≤ €28,406: €3,068
- €28,406 – €76,817: €3,068 − 6.337% × (income − €28,406)
- ≥ €76,817: €0

### Labour Tax Credit (Arbeidskorting)

- Income ≤ €12,169: 8.053% × income
- €12,169 – €26,288: €980 + 30.030% × (income − €12,169)
- €26,288 – €43,071: €5,220 + 2.258% × (income − €26,288)
- €43,071 – €129,078: €5,599 − 6.510% × (income − €43,071)
- ≥ €129,078: €0

## Usage

1. Enter your annual gross income
2. View your effective tax rate, tax amount, and net income
3. Reference the income tax and tax credit tables for detailed information

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- No external dependencies
