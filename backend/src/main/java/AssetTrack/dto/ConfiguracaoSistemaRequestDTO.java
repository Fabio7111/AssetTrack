package AssetTrack.dto;

public record ConfiguracaoSistemaRequestDTO(
        String nomeOrganizacao,
        String telefone,
        String emailSuporte,
        Boolean alertaBaixoEstoque,
        Boolean alertaDevolucaoAtrasada
) {}