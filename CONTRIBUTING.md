# Contributing to TrustFund

Thank you for your interest in contributing to TrustFund! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)

### Suggesting Features

Feature suggestions are welcome! Please:
- Check existing issues first
- Provide clear use case
- Explain why this feature would be useful
- Consider implementation complexity

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/trustfund.git
   cd trustfund
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed
   - Test your changes thoroughly

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   Use conventional commit messages:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Provide clear description
   - Reference related issues
   - Include screenshots for UI changes

## 📋 Development Guidelines

### Code Style

- Use ES6+ features
- Follow existing naming conventions
- Use meaningful variable/function names
- Keep functions small and focused
- Add JSDoc comments for complex functions

### Component Structure

```javascript
// Imports
import styled from 'styled-components';
import { useState } from 'react';

// Component
const MyComponent = ({ prop1, prop2 }) => {
  // State
  const [state, setState] = useState(null);

  // Handlers
  const handleClick = () => {
    // logic
  };

  // Render
  return (
    <Wrapper>
      {/* JSX */}
    </Wrapper>
  );
};

// Styled Components
const Wrapper = styled.div`
  /* styles */
`;

export default MyComponent;
```

### Styling Guidelines

- Use styled-components for all styling
- Follow theme variables from `components/layout/themes.js`
- Ensure responsive design (mobile-first approach)
- Test both light and dark themes
- Add smooth transitions for interactive elements

### Smart Contract Changes

If modifying smart contracts:
- Write comprehensive tests
- Document all functions with NatSpec
- Consider gas optimization
- Run security checks
- Update deployment scripts if needed

### Testing

Before submitting PR:
- Test on local development environment
- Test wallet connections
- Test all user flows
- Check responsive design
- Verify dark/light theme compatibility
- Test error handling

## 🔍 Code Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, PR will be merged
4. Your contribution will be acknowledged

## 🎯 Priority Areas

Current focus areas for contributions:
- Performance optimizations
- Accessibility improvements
- Additional test coverage
- Documentation enhancements
- UI/UX refinements
- Mobile responsiveness
- Multi-language support

## 📝 Documentation

When adding features:
- Update README.md if needed
- Add inline code comments
- Update PROJECT-GUIDE.md for architecture changes
- Include usage examples

## ⚖️ Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what's best for the project

## 🙋 Questions?

- Open a discussion on GitHub
- Check existing documentation
- Review closed issues for similar questions

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to TrustFund! 🎉
