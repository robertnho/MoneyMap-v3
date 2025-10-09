# Script de teste para funcionalidade de redefinicao de senha
# Execute: .\test-reset-password.ps1

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Teste: Esqueceu a Senha" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# 1. Testar /forgot-password
Write-Host "1. Testando POST /auth/forgot-password..." -ForegroundColor Yellow

$forgotBody = @{
    email = "teste@exemplo.com"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/auth/forgot-password" `
        -Method Post `
        -ContentType "application/json" `
        -Body $forgotBody
    
    Write-Host "Sucesso!" -ForegroundColor Green
    Write-Host "Resposta: $($response | ConvertTo-Json)" -ForegroundColor Gray
    Write-Host "`nVerifique o console do servidor para ver o TOKEN gerado!`n" -ForegroundColor Yellow
    
    # Se retornar o token (dev mode)
    if ($response.token) {
        Write-Host "Token encontrado na resposta (modo dev): $($response.token)`n" -ForegroundColor Magenta
        
        # 2. Testar /reset-password
        Write-Host "2. Testando POST /auth/reset-password..." -ForegroundColor Yellow
        
        $resetBody = @{
            token = $response.token
            newPassword = "novaSenha123"
        } | ConvertTo-Json
        
        Start-Sleep -Seconds 1
        
        $resetResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/reset-password" `
            -Method Post `
            -ContentType "application/json" `
            -Body $resetBody
        
        Write-Host "Senha redefinida com sucesso!" -ForegroundColor Green
        Write-Host "Resposta: $($resetResponse | ConvertTo-Json)" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Detalhes: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Teste concluido!" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan
