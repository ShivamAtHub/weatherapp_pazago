import { render, screen } from "@testing-library/react"
import WeatherChat from "./WeatherChat"

test("renders input field", () => {
  render(<WeatherChat />)

  const input = screen.getByPlaceholderText(/ask about the weather/i)
  expect(input).toBeInTheDocument()
})

test("send button is disabled when input is empty", () => {
  render(<WeatherChat />)

  const sendButton = screen.getByRole("button", { name: /send/i })
  expect(sendButton).toBeDisabled()
})
